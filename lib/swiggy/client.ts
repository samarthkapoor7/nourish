import 'server-only';
import { randomUUID } from 'crypto';
import { SWIGGY_MCP_SERVERS } from './config';
import { SwiggyReauthRequiredError, SwiggyToolError } from './errors';
import { SWIGGY_MCP_PROTOCOL_VERSION } from './mcp-config';
import {
  extractMcpToolErrorMessage,
  extractMcpToolPayload,
  readMcpSseFrame,
  unwrapSwiggyEnvelope,
  type McpToolResult,
} from './mcp-parse';
import {
  clearMcpSessionCookie,
  getMcpSessionIdFromCookies,
  setMcpSessionCookie,
} from './mcp-session';
import type { SwiggyServer } from './types';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params?: unknown;
}

interface JsonRpcResponse<T = unknown> {
  jsonrpc: string;
  id?: string | number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}

async function mcpRequest<T>(
  server: SwiggyServer,
  method: string,
  params: unknown,
  accessToken: string,
  sessionId?: string | null,
  includeId = true,
): Promise<{ payload: JsonRpcResponse<T>; sessionId?: string }> {
  const body: JsonRpcRequest | { jsonrpc: '2.0'; method: string; params?: unknown } = includeId
    ? { jsonrpc: '2.0', id: randomUUID(), method, params }
    : { jsonrpc: '2.0', method, params };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'mcp-protocol-version': SWIGGY_MCP_PROTOCOL_VERSION,
    Authorization: `Bearer ${accessToken}`,
  };

  if (sessionId) {
    headers['mcp-session-id'] = sessionId;
  }

  const response = await fetch(SWIGGY_MCP_SERVERS[server], {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (response.status === 401 || response.status === 403) {
    throw new SwiggyReauthRequiredError();
  }

  const responseSessionId = response.headers.get('mcp-session-id') ?? undefined;
  const contentType = response.headers.get('content-type') ?? '';

  let rpc: JsonRpcResponse<T> | undefined;

  if (contentType.includes('text/event-stream')) {
    rpc = await readMcpSseFrame<T>(response);
  } else {
    const text = await response.text();
    if (text) {
      try {
        rpc = JSON.parse(text) as JsonRpcResponse<T>;
      } catch {
        throw new SwiggyToolError(`Invalid JSON-RPC response from Swiggy MCP (${server})`, {
          status: response.status,
        });
      }
    }
  }

  if (!rpc) {
    throw new SwiggyToolError(`Empty response from Swiggy MCP (${server})`, {
      status: response.status,
    });
  }

  if (rpc.error?.code === -32001) {
    throw new SwiggyReauthRequiredError();
  }

  if (rpc.error) {
    throw new SwiggyToolError(rpc.error.message, { status: response.status });
  }

  if (!response.ok) {
    throw new SwiggyToolError(`Swiggy MCP request failed (${server})`, {
      status: response.status,
    });
  }

  return { payload: rpc, sessionId: responseSessionId };
}

async function ensureMcpSession(server: SwiggyServer, accessToken: string): Promise<string | undefined> {
  let sessionId = (await getMcpSessionIdFromCookies()) ?? undefined;

  const { payload, sessionId: newSessionId } = await mcpRequest(
    server,
    'initialize',
    {
      protocolVersion: SWIGGY_MCP_PROTOCOL_VERSION,
      capabilities: { tools: {} },
      clientInfo: { name: 'nourish', version: '0.1.0' },
    },
    accessToken,
    sessionId,
  );

  sessionId = newSessionId ?? sessionId;
  if (sessionId) {
    await setMcpSessionCookie(sessionId);
  }

  if (!payload.result) {
    throw new SwiggyToolError(`MCP initialize failed for Swiggy (${server})`);
  }

  try {
    await mcpRequest(
      server,
      'notifications/initialized',
      {},
      accessToken,
      sessionId,
      false,
    );
  } catch {
    // Non-fatal per swiggy-cli.
  }

  return sessionId;
}

/**
 * Calls a single tool on a Swiggy MCP server using Streamable HTTP MCP:
 * initialize handshake, session id, Accept header, then tools/call.
 */
export async function callSwiggyTool<T = unknown>(
  server: SwiggyServer,
  toolName: string,
  args: Record<string, unknown>,
  accessToken: string,
): Promise<T> {
  const detailed = await callSwiggyToolDetailed<T>(server, toolName, args, accessToken);
  return detailed.data;
}

export interface SwiggyToolCallDetails<T> {
  data: T;
  message?: string;
  textContent?: string;
}

export async function callSwiggyToolDetailed<T = unknown>(
  server: SwiggyServer,
  toolName: string,
  args: Record<string, unknown>,
  accessToken: string,
): Promise<SwiggyToolCallDetails<T>> {
  const run = async (): Promise<SwiggyToolCallDetails<T>> => {
    const activeSessionId = await ensureMcpSession(server, accessToken);

    const toolResponse = await mcpRequest<McpToolResult>(
      server,
      'tools/call',
      { name: toolName, arguments: args },
      accessToken,
      activeSessionId,
    );

    if (toolResponse.sessionId) {
      await setMcpSessionCookie(toolResponse.sessionId);
    }

    const result = toolResponse.payload.result;
    if (!result) {
      throw new SwiggyToolError(`Missing tool result from Swiggy MCP (${server})`);
    }

    if (result.isError) {
      throw new SwiggyToolError(
        extractMcpToolErrorMessage(result) ?? `Swiggy tool "${toolName}" failed`,
      );
    }

    try {
      const toolPayload = extractMcpToolPayload(result);
      const { data, message } = unwrapSwiggyEnvelope<T>(toolPayload);
      const textContent = (result.content ?? [])
        .filter((chunk) => chunk.type === 'text' && typeof chunk.text === 'string')
        .map((chunk) => chunk.text as string)
        .join('\n');

      return { data, message, textContent: textContent || undefined };
    } catch (error) {
      if (error instanceof SwiggyToolError || error instanceof SwiggyReauthRequiredError) {
        throw error;
      }
      throw new SwiggyToolError(
        error instanceof Error ? error.message : `Failed to parse Swiggy tool "${toolName}" response`,
      );
    }
  };

  try {
    return await run();
  } catch (error) {
    if (error instanceof SwiggyReauthRequiredError) throw error;

    await clearMcpSessionCookie();
    return await run();
  }
}
