
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { simpleWorkflow } from './workflows/simple-workflow';
import { parallelWorkflow } from './workflows/parallel-workflow';
import { conditionalWorkflow } from './workflows/conditional-workflow';
import { weatherAgent } from './agents/weather-agent';
import { financialAgent } from './agents/financial-agent';
import { memoryMasterAgent } from './agents/memory-agent';
import { learningAssistantAgent } from './agents/learning-assistant';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, simpleWorkflow, parallelWorkflow, conditionalWorkflow },
  agents: { weatherAgent, financialAgent, memoryMasterAgent, learningAssistantAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
