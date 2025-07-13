import { MCPClient } from "@mastra/mcp";
import path from "path";

const noteDirectory = process.env.NOTES_DIRECTORY || "";
console.log({noteDirectory});

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
    textEditor: {
      command: "pnpx",
      args: [
        "@modelcontextprotocol/server-filesystem",
        noteDirectory,
      ],
    },
  },
});

// Initialize MCP tools
export const initializeMCPTools = async () => {
  const mcpTools = await mcp.getTools();
  return mcpTools;
}; 