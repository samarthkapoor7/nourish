import 'server-only';
import { SWIGGY_MCP_SERVERS } from './config';
import { SwiggyReauthRequiredError, SwiggyToolError } from './errors';
import type { SwiggyServer, SwiggyToolResult } from './types';

/**
 * Calls a single tool on a Swiggy MCP server over JSON-RPC 2.0, per the
 * curl examples throughout https://mcp.swiggy.com/builders/llms-full.txt
 * (e.g. docs/reference/food/get_addresses.md). The docs never show an
 * `initialize` handshake or session-negotiation step before `tools/call`,
 * so none is implemented here - only what's documented.
 *
 * Throws SwiggyReauthRequiredError on 401 / JSON-RPC -32001 (the docs'
 * classification: "re-run the OAuth flow, never retry with the same
 * token"). Throws SwiggyToolError for every other failure, carrying the
 * HTTP status so callers can apply the docs' retry buckets (5xx retriable,
 * 4xx / success:false generally terminal).
 */
export async function callSwiggyTool<T = unknown>(
  server: SwiggyServer,
  toolName: string,
  args: Record<string, unknown>,
  accessToken: string,
): Promise<T> {
  const response = await fetch(SWIGGY_MCP_SERVERS[server], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: toolName, arguments: args },
      id: 1,
    }),
  });

  if (response.status === 401) {
    throw new SwiggyReauthRequiredError();
  }

  const body = await response.json().catch(() => null);

  // The docs describe two coexisting contracts - a JSON-RPC error code
  // (-32001 for auth) "at the transport layer", and a `{success, data|error}`
  // envelope as "the primary contract". Some responses may nest the
  // envelope inside a JSON-RPC `result`; handle both shapes defensively
  // rather than assume one.
  const rpcErrorCode = body?.error?.code;
  if (rpcErrorCode === -32001) {
    throw new SwiggyReauthRequiredError();
  }

  const envelope: SwiggyToolResult<T> | null = body?.result ?? body;

  if (!envelope || typeof envelope !== 'object' || !('success' in envelope)) {
    throw new SwiggyToolError(`Unexpected response shape from Swiggy MCP (${server})`, {
      status: response.status,
    });
  }

  if (!envelope.success) {
    throw new SwiggyToolError(envelope.error.message, {
      status: response.status,
      reportLink: envelope.error.reportLink,
      reportHint: envelope.error.reportHint,
    });
  }

  return envelope.data;
}
