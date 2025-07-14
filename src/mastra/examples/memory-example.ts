import { memoryAgent } from '../agents/memory-agent';

// Example function demonstrating memory usage in a real application
export async function demonstrateMemoryUsage() {
  // Simulate a conversation with proper memory management
  const resourceId = "user_alice";  // In a real app, this would be your user's ID
  const threadId = "conversation_" + Date.now();  // In a real app, you might generate this when starting a new conversation

  // First message
  const response1 = await memoryAgent.stream("Hello, my name is Alice.", {
    resourceId,
    threadId,
  });
  console.log("Agent Response 1:", response1);

  // Second message - the agent should remember Alice's name
  const response2 = await memoryAgent.stream("What's my name?", {
    resourceId,
    threadId,
  });
  console.log("Agent Response 2:", response2);

  // Third message - starting a new thread
  const newThreadId = "conversation_" + Date.now();
  const response3 = await memoryAgent.stream("What's my name?", {
    resourceId,
    threadId: newThreadId,  // New thread won't have memory of the previous conversation
  });
  console.log("Agent Response 3:", response3);
}

// Example of how you might use this in a real application:
/*
interface User {
  id: string;
  activeThreadId?: string;
}

async function handleUserMessage(user: User, message: string) {
  // Create a new thread if user doesn't have an active one
  if (!user.activeThreadId) {
    user.activeThreadId = `thread_${Date.now()}`;
  }

  const response = await memoryAgent.stream(message, {
    resourceId: user.id,
    threadId: user.activeThreadId,
  });

  return response;
}
*/ 