import 'server-only';

/**
 * Raised when a Swiggy MCP call comes back unauthenticated/expired
 * (HTTP 401 or JSON-RPC -32001). Swiggy issues no refresh tokens in v1.0,
 * so the only valid reaction is "re-run the OAuth flow" - never retry with
 * the same token. See lib/swiggy/client.ts for where this is thrown.
 */
export class SwiggyReauthRequiredError extends Error {
  constructor(message = 'Swiggy session expired or invalid - re-run the OAuth flow.') {
    super(message);
    this.name = 'SwiggyReauthRequiredError';
  }
}

/**
 * A tool call reached Swiggy and got a well-formed `{ success: false }`
 * response, or a non-2xx/non-401 HTTP status. `status` and `reportLink`
 * mirror the fields Swiggy's error envelope documents.
 */
export class SwiggyToolError extends Error {
  readonly status?: number;
  readonly reportLink?: string;
  readonly reportHint?: string;

  constructor(
    message: string,
    options?: { status?: number; reportLink?: string; reportHint?: string },
  ) {
    super(message);
    this.name = 'SwiggyToolError';
    this.status = options?.status;
    this.reportLink = options?.reportLink;
    this.reportHint = options?.reportHint;
  }
}

/** True for the retriable bucket per the docs: generic 5xx / upstream timeouts. */
export function isRetryableSwiggyError(error: unknown): boolean {
  if (!(error instanceof SwiggyToolError)) return false;
  const status = error.status;
  return typeof status === 'number' && status >= 500 && status < 600;
}
