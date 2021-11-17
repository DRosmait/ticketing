import mongoose from "mongoose";

import app from "./app";
import natsWrapper from "./nats-wrapper";

const start = async () => {
  const variableNames = [
    "JWT_KEY",
    "MONGO_URI",
    "NATS_CLIENT_ID",
    "NATS_URL",
    "NATS_CLUSTER_ID",
  ];

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

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(5000, () => {
    console.log("Server is listening on port 5000!!!");
  });
};

start();