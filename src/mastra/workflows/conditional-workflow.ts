import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: Analyze user request
const analyzeRequest = createStep({
  id: 'analyze-request',
  description: 'Analyzes user request to determine the type of response needed',
  inputSchema: z.object({
    userInput: z.string().describe('User input to analyze'),
  }),
  outputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { userInput } = inputData;
    const input = userInput.toLowerCase();
    
    let requestType: 'weather' | 'calculation' | 'greeting' | 'other' = 'other';
    let confidence = 0.5;
    
    // Simple keyword-based analysis
    if (input.includes('weather') || input.includes('temperature') || input.includes('rain') || input.includes('sunny')) {
      requestType = 'weather';
      confidence = 0.9;
    } else if (input.includes('calculate') || input.includes('math') || /\d+[\+\-\*/]\d+/.test(input)) {
      requestType = 'calculation';
      confidence = 0.8;
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      requestType = 'greeting';
      confidence = 0.9;
    }
    
    return {
      requestType,
      originalInput: userInput,
      confidence,
    };
  },
});

// Step 2a: Handle weather requests
const handleWeatherRequest = createStep({
  id: 'handle-weather',
  description: 'Handles weather-related requests',
  inputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
  outputSchema: z.object({
    response: z.string(),
    type: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { originalInput } = inputData;
    
    // Extract city if mentioned, otherwise use default
    const cityMatch = originalInput.match(/in\s+([a-zA-Z\s]+)/i);
    const city = cityMatch ? cityMatch[1].trim() : 'your location';
    
    return {
      response: `I can help you with weather information for ${city}! The weather tool would normally fetch real data here. For now, let's say it's sunny and 22°C.`,
      type: 'weather',
    };
  },
});

// Step 2b: Handle calculation requests
const handleCalculationRequest = createStep({
  id: 'handle-calculation',
  description: 'Handles calculation requests',
  inputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
  outputSchema: z.object({
    response: z.string(),
    type: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { originalInput } = inputData;
    
    // Try to extract and evaluate a simple math expression
    const mathMatch = originalInput.match(/(\d+)\s*[\+\-\*/]\s*(\d+)/);
    
    if (mathMatch) {
      const expression = mathMatch[0];
      try {
        const result = eval(expression);
        return {
          response: `The result of ${expression} is ${result}`,
          type: 'calculation',
        };
      } catch (error) {
        return {
          response: `I found a math expression (${expression}) but couldn't calculate it safely.`,
          type: 'calculation',
        };
      }
    }
    
    return {
      response: `I can help with calculations! Please provide a math expression like "5 + 3" or "10 * 2".`,
      type: 'calculation',
    };
  },
});

// Step 2c: Handle greeting requests
const handleGreetingRequest = createStep({
  id: 'handle-greeting',
  description: 'Handles greeting requests',
  inputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
  outputSchema: z.object({
    response: z.string(),
    type: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const greetings = [
      "Hello! How can I help you today?",
      "Hi there! I'm here to assist with weather, calculations, or just chat!",
      "Hey! What would you like to know?",
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return {
      response: randomGreeting,
      type: 'greeting',
    };
  },
});

// Step 2d: Handle other requests
const handleOtherRequest = createStep({
  id: 'handle-other',
  description: 'Handles other types of requests',
  inputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
  outputSchema: z.object({
    response: z.string(),
    type: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    return {
      response: `I'm not sure how to handle that request, but I can help with weather information, calculations, or just say hello! What would you like to know?`,
      type: 'other',
    };
  },
});

// Create conditional workflow (simplified version)
const conditionalWorkflow = createWorkflow({
  id: 'conditional-workflow',
  inputSchema: z.object({
    userInput: z.string().describe('User input to process'),
  }),
  outputSchema: z.object({
    requestType: z.enum(['weather', 'calculation', 'greeting', 'other']),
    originalInput: z.string(),
    confidence: z.number(),
  }),
})
  .then(analyzeRequest);

conditionalWorkflow.commit();

export { conditionalWorkflow }; 