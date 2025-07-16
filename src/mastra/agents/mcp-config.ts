import { MCPClient } from "@mastra/mcp";

const noteDirectory = process.env.NOTES_DIRECTORY || "";

// Prepare servers configuration
const servers: Record<string, any> = {
  hackernews: {
    command: "npx",
    args: ["-y", "@devabdultech/hn-mcp-server"],
  },
  textEditor: {
    command: "pnpx",
    args: [
      "@modelcontextprotocol/server-filesystem",
      noteDirectory,
    ],
  },
};

// Only add Zapier if URL is 
if (process.env.ZAPIER_MCP_URL) {
  servers.zapier = {
    url: new URL(process.env.ZAPIER_MCP_URL),
  };
}

// Only add GitHub if URL is configured
if (process.env.COMPOSIO_MCP_GITHUB) {
  servers.github = {
    url: new URL(process.env.COMPOSIO_MCP_GITHUB),
  };
}

const mcp = new MCPClient({
  servers,
});

// Initialize MCP tools
export const initializeMCPTools = async () => {
  const mcpTools = await mcp.getTools();
  return mcpTools;
}; 