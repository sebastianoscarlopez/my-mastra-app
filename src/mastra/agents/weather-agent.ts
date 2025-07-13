import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';
import { dlocalLlmProxy } from './dlocal-llm-proxy';
import { calculatorTool } from '../tools/calculator-tool';
import { fastembed } from "@mastra/fastembed";

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.
      - If the user asks for activities, respond in the format they request.

      Use the weatherTool to fetch current weather data.
      Alo use the simpleWorkflow to get metadata about the message.
`,
  model: dlocalLlmProxy('gemini-2.0-flash-lite'),
  tools: { weatherTool, calculatorTool },
  memory: new Memory({
    embedder: fastembed,
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
    // this is the default vector db if omitted
    vector: new LibSQLVector({
      connectionUrl: "file:../mastra.db",
    }),
    options: {
      semanticRecall: {
        topK: 5,
        messageRange: 10,
        scope: 'resource',
      },
      workingMemory: {
        enabled: true,
        scope: 'resource',
      },
    },
  }),
});
