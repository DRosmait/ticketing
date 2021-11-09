import mongoose from "mongoose";

import app from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env variable should be defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(5000, () => {
    console.log("Server is listening on port 5000!!!");
  });
};

start();
