import express from "express";

import { Ticket } from "../models";

const router = express.Router();

router.get("/api/tickets", async (req, res) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

export { router as showAllTicketsRouter };
