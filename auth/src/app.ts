import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes";

import { NotFoundError } from "./errors";

import { errorHandler } from "./middlewares";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
