import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { dlocalLlmProxy } from "./dlocal-llm-proxy";

// Create a memory instance with custom conversation history settings
const memory = new Memory({
  // Configure storage with LibSQL (good for development)
  // For production, consider using PostgreSQL or Upstash:
  // import { PgStore } from "@mastra/pg";
  // import { UpstashStore } from "@mastra/upstash";
  storage: new LibSQLStore({
    url: "file:./memory.db", // relative path from the .mastra/output directory
    // For production with Turso:
    // url: process.env.DATABASE_URL,
    // authToken: process.env.DATABASE_AUTH_TOKEN,
  }),
  options: {
    lastMessages: 20, // Include the last 20 messages in the context
  },
});

// Create an agent with memory
export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.

    You have access to the last 20 messages of conversation history, which helps you maintain better context
    and provide more relevant responses based on recent interactions.
  `,
  model: dlocalLlmProxy('gpt-4o-mini'),
  memory: memory,
}); 