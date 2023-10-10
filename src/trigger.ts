import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "node-18-no-fetch-7aF6",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
