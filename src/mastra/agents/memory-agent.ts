import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { dlocalLlmProxy } from "./dlocal-llm-proxy";
import { fastembed } from "@mastra/fastembed";

// Create a memory instance with custom conversation history and working memory settings
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
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Information
- Name: [User's name]
- Location: [User's location]
- Timezone: [User's timezone]

## Preferences & Interests
- Communication Style: [e.g., Formal, Casual]
- Interests: [User's interests and hobbies]
- Favorite Topics: [Topics the user enjoys discussing]
- Other Preferences: [Any other user preferences]

## Conversation Context
- Current Topic: [Active discussion topic]
- Open Questions: [Any pending questions or topics]
  - [Question 1]
  - [Question 2]

## Important Details
[Any other relevant information about the user or ongoing tasks that doesn't fit above]
`,
    },
  },
});

// Create an agent with memory
export const memoryMasterAgent = new Agent({
  name: "MemoryMasterAgent",
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    
    You have access to:
    1. Working Memory:
       - Store and update persistent user information
       - Follow the template structure for organization
       - Update as soon as you learn new information
       - Remove placeholder text [in brackets] when adding real information
    
    2. Conversation History:
       - The last 20 messages of conversation history
       - Semantic search to find relevant information from older conversations
         * You can find up to 3 most relevant past messages
         * For each relevant message, you see 2 messages before and 1 after for context
         * Search is limited to the current conversation thread
    
    Working Memory Guidelines:
    1. Keep the working memory organized using the provided template
    2. Update information as soon as you learn it
    3. Use markdown formatting to maintain structure
    4. Add new sections if needed while maintaining the format
    5. When the user shares personal information, acknowledge it and update your memory
    
    Always refer to your working memory before asking for information the user has already provided.
    Use both working memory and conversation history to provide personalized and contextually relevant responses.
    When recalling information from older conversations, mention that you're referring to a previous discussion.
  `,
  model: dlocalLlmProxy('gpt-4o-mini'),
  memory: memory,
}); 