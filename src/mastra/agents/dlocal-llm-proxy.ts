import { createOpenAICompatible, OpenAICompatibleEmbeddingModel } from "@ai-sdk/openai-compatible";

export const dlocalLlmProxy = createOpenAICompatible({
  name: "dlocal-llm-proxy",
  baseURL: process.env.MODEL_BASE_URL || "",
  apiKey: process.env.MODEL_API_KEY || "",
  headers: {},
  queryParams: {},
  fetch: async (url, options) => {
      // custom fetch logic
      return fetch(url, options);
  }
});
