import mongoose from "mongoose";

import app from "./app";

const start = async () => {
  console.log("Starting up...");
  
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env variable should be defined.");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(5000, () => {
    console.log("Server is listening on port 5000!!!");
  });
};

start();
