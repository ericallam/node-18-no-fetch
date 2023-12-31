import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";

client.defineJob({
  id: "auto-yield-1",
  name: "Auto Yield 1",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "auto.yield.1",
  }),
  run: async (payload, io, ctx) => {
    await io.runTask("initial-long-task", async (task) => {
      await new Promise((resolve) => setTimeout(resolve, payload.initial));

      return {
        message: "initial-long-task",
      };
    });

    for (let i = 0; i < payload.iterations; i++) {
      await io.runTask(`task.${i}`, async (task) => {
        // Create a random number between 250 and 1250
        const random = Math.floor(Math.random() * 1000) + 250;

        await new Promise((resolve) => setTimeout(resolve, random));

        await fetch(process.env.REQUEST_BIN_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `task.${i}`,
            random,
            idempotencyKey: task.idempotencyKey,
            runId: ctx.run.id,
          }),
        });

        return {
          message: `task.${i}`,
          random,
        };
      });
    }
  },
});
