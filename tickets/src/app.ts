import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@amid3ntickets/common";

import {
  createTicketRouter,
  showTicketRouter,
  showAllTicketsRouter,
  updateTicketRouter,
} from "./routes";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketsRouter);
app.use(updateTicketRouter);

app.use("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
