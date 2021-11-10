import express from "express";
import { NotFoundError } from "@amid3ntickets/common";

import { Ticket } from "../models";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
