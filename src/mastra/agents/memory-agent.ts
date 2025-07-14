import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { dlocalLlmProxy } from "./dlocal-llm-proxy";
import { fastembed } from "@mastra/fastembed";

// Create a memory instance with custom conversation history settings
const memory = new Memory({
  // Configure storage with LibSQL (good for development)
  storage: new LibSQLStore({
    url: "file:./memory.db", // relative path from the .mastra/output directory
  }),
  // Configure vector store for semantic search capabilities
  vector: new LibSQLVector({
    connectionUrl: "file:./vector.db", // separate database for vector storage
  }),
  embedder: fastembed,
  options: {
    lastMessages: 20, // Include the last 20 messages in the context
    semanticRecall: {
      topK: 3, // Number of similar messages to retrieve
      messageRange: {
        before: 2, // Include 2 messages before each match
        after: 1,  // Include 1 message after each match
      },
      scope: "thread", // Only search within the current thread
    },
  },
});

// Create an agent with memory
export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.

    You have access to:
    - The last 20 messages of conversation history
    - Semantic search to find relevant information from older conversations
      * You can find up to 3 most relevant past messages
      * For each relevant message, you see 2 messages before and 1 after for context
      * Search is limited to the current conversation thread
    
    Use these capabilities to provide more personalized and contextually relevant responses.
    When recalling information from older conversations, mention that you're referring to a previous discussion.
  `,
  model: dlocalLlmProxy('gpt-4o-mini'),
  memory: memory,
}); 