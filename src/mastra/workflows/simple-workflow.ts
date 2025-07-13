import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: Process user input
const processInput = createStep({
  id: 'process-input',
  description: 'Processes user input and extracts information',
  inputSchema: z.object({
    userMessage: z.string().describe('The user message to process'),
  }),
  outputSchema: z.object({
    processedMessage: z.string(),
    wordCount: z.number(),
    timestamp: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { userMessage } = inputData;
    
    return {
      processedMessage: userMessage.trim().toLowerCase(),
      wordCount: userMessage.split(' ').length,
      timestamp: new Date().toISOString(),
    };
  },
});

// Step 2: Generate response
const generateResponse = createStep({
  id: 'generate-response',
  description: 'Generates a response based on processed input',
  inputSchema: z.object({
    processedMessage: z.string(),
    wordCount: z.number(),
    timestamp: z.string(),
  }),
  outputSchema: z.object({
    response: z.string(),
    metadata: z.object({
      wordCount: z.number(),
      processedAt: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { processedMessage, wordCount, timestamp } = inputData;
    
    let response = '';
    
    if (processedMessage.includes('weather')) {
      response = `I see you're asking about weather! Your message had ${wordCount} words.`;
    } else if (processedMessage.includes('calculate')) {
      response = `I can help with calculations! Your message had ${wordCount} words.`;
    } else {
      response = `I received your message with ${wordCount} words. How can I help you?`;
    }
    
    return {
      response,
      metadata: {
        wordCount,
        processedAt: timestamp,
      },
    };
  },
});

// Create the workflow by chaining steps
const simpleWorkflow = createWorkflow({
  id: 'simple-workflow',
  inputSchema: z.object({
    userMessage: z.string().describe('The user message to process'),
  }),
  outputSchema: z.object({
    response: z.string(),
    metadata: z.object({
      wordCount: z.number(),
      processedAt: z.string(),
    }),
  }),
})
  .then(processInput)
  .then(generateResponse)

// Commit the workflow
simpleWorkflow.commit();

export { simpleWorkflow }; 