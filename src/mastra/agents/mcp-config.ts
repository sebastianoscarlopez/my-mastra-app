import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ""),
    },
    github: {
      url: new URL(process.env.COMPOSIO_MCP_GITHUB || ""),
    },
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
  },
});

// Initialize MCP tools
export const initializeMCPTools = async () => {
  const mcpTools = await mcp.getTools();
  return mcpTools;
}; 