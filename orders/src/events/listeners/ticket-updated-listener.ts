import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@amid3ntickets/common";

import { Ticket } from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "orders-service";

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({
      title: data.title,
      price: data.price,
    });
    await ticket.save();

    msg.ack();
  }
}
