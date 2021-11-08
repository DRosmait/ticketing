import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request, { Response } from "supertest";

import app from "../app";

declare global {
  function signin(): Promise<[Response, string[]]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "somekey";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (let key in collections) {
    collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = async function () {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return [response, cookie];
};
