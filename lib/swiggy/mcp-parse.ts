import { SwiggyToolError } from './errors';
import type { SwiggyToolResult } from './types';

export interface McpToolResult {
  content?: Array<{ type: string; text?: string; [key: string]: unknown }>;
  structuredContent?: unknown;
  isError?: boolean;
  [key: string]: unknown;
}

interface JsonRpcResponse<T = unknown> {
  jsonrpc: string;
  id?: string | number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}

/**
 * Pulls the Swiggy tool payload out of a standard MCP tools/call result.
 * Mirrors HKTITAN/swiggy-cli's extractToolPayload.
 */
export function extractMcpToolPayload(result: McpToolResult): unknown {
  if (result.structuredContent !== undefined) return result.structuredContent;

  if (Array.isArray(result.content)) {
    const texts = result.content
      .filter((chunk) => chunk.type === 'text' && typeof chunk.text === 'string')
      .map((chunk) => chunk.text as string);

    if (texts.length === 1) {
      try {
        return JSON.parse(texts[0]);
      } catch {
        return texts[0];
      }
    }

    if (texts.length > 1) return texts;
  }

  return result;
}

export function parseSwiggyToolEnvelope<T>(payload: unknown): T {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Empty tool payload from Swiggy MCP');
  }

  if ('success' in payload) {
    const envelope = payload as SwiggyToolResult<T>;
    if (!envelope.success) {
      throw new SwiggyToolError(envelope.error.message, {
        reportLink: envelope.error.reportLink,
        reportHint: envelope.error.reportHint,
      });
    }
    return envelope.data as T;
  }

  // Some tools may return the data object directly inside structuredContent.
  return payload as T;
}

export function unwrapSwiggyEnvelope<T>(payload: unknown): { data: T; message?: string } {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Empty tool payload from Swiggy MCP');
  }

  if ('success' in payload) {
    const envelope = payload as SwiggyToolResult<T>;
    if (!envelope.success) {
      throw new SwiggyToolError(envelope.error.message, {
        reportLink: envelope.error.reportLink,
        reportHint: envelope.error.reportHint,
      });
    }
    return { data: envelope.data as T, message: envelope.message };
  }

  return { data: payload as T };
}

export async function readMcpSseFrame<T>(response: Response): Promise<JsonRpcResponse<T> | undefined> {
  if (!response.body) return undefined;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const dataLines = event
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart());

        if (dataLines.length === 0) continue;

        try {
          const parsed = JSON.parse(dataLines.join('\n')) as JsonRpcResponse<T>;
          if ('id' in parsed || parsed.result !== undefined || parsed.error !== undefined) {
            return parsed;
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return undefined;
}

export function extractMcpToolErrorMessage(result: McpToolResult): string | undefined {
  const texts = (result.content ?? [])
    .filter((chunk) => chunk?.type === 'text' && typeof chunk.text === 'string')
    .map((chunk) => (chunk.text as string).trim())
    .filter((text) => text.length > 0);

  if (texts.length === 0) return undefined;

  const first = texts[0]!;
  try {
    const parsed = JSON.parse(first) as { error?: { message?: string }; message?: string };
    if (typeof parsed?.error?.message === 'string') return parsed.error.message;
    if (typeof parsed?.message === 'string') return parsed.message;
  } catch {
    // keep raw text
  }

  return first;
}
