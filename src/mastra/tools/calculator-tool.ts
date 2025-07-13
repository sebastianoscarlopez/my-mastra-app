import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const calculatorTool = createTool({
  id: 'calculator',
  description: 'Perform basic mathematical calculations',
  inputSchema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 3 * 4")'),
  }),
  outputSchema: z.object({
    result: z.number(),
    expression: z.string(),
  }),
  execute: async ({ context }) => {
    const { expression } = context;
    
    try {
      // Simple and safe evaluation - only allows basic math operations
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = eval(sanitizedExpression);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }
      
      return {
        result,
        expression: sanitizedExpression,
      };
    } catch (error) {
      throw new Error(`Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
}); 