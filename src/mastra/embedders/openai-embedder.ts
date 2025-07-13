import { openai } from '@ai-sdk/openai';

// OpenAI Text Embedding Models
export const openaiTextEmbedding3Small = openai.textEmbeddingModel('text-embedding-3-small');
export const openaiTextEmbedding3Large = openai.textEmbeddingModel('text-embedding-3-large');
export const openaiTextEmbeddingAda002 = openai.textEmbeddingModel('text-embedding-ada-002');

// Default OpenAI embedder - using the most recent and cost-effective model
export const openaiEmbedder = openaiTextEmbedding3Small;

// Configuration for different use cases
export const openaiEmbedders = {
  // Most cost-effective for general use
  small: openaiTextEmbedding3Small,
  
  // Higher performance for complex tasks
  large: openaiTextEmbedding3Large,
  
  // Legacy model for backward compatibility
  ada002: openaiTextEmbeddingAda002
};

// Example usage:
// import { openaiEmbedder } from './openai-embedder';
// import { embed } from 'ai';
// 
// const result = await embed({
//   model: openaiEmbedder,
//   value: 'Your text to embed'
// });
// console.log(result.embedding); 