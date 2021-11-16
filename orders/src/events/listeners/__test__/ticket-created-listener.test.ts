import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@amid3ntickets/common";

import { TicketCreatedListener } from "../ticket-created-listener";
import natsWrapper from "../../../nats-wrapper";
import { Ticket } from "../../../models";

const setup = () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const event: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, event, msg };
};

describe("ticket-created-listener.ts", () => {
  it("creates and saves a ticket", async () => {
    const { listener, event, msg } = setup();

    // call the onMessage function with the data object and message
    await listener.onMessage(event, msg);

    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(event.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(event.title);
    expect(ticket!.price).toEqual(event.price);
  });

  it("acks the message", async () => {
    const { listener, event, msg } = setup();

    await listener.onMessage(event, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
