import { OrderCreatedListener } from "./events";
import natsWrapper from "./nats-wrapper";

const start = async () => {
  const variableNames = ["NATS_CLIENT_ID", "NATS_URL", "NATS_CLUSTER_ID"];

  variableNames.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} env variable should be defined.`);
    }
  });

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
