export const SWIGGY_MCP_CONFIG = {
  serverUrl: process.env.SWIGGY_MCP_SERVER_URL ?? '',
  apiKey: process.env.SWIGGY_MCP_API_KEY ?? '',
} as const;
