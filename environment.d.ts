declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MODEL_BASE_URL: string;
      MODEL_API_KEY: string;
      ZAPIER_MCP_URL: string;
      COMPOSIO_MCP_GITHUB: string;
      NOTES_DIRECTORY: string;
    }
  }
}

export {};