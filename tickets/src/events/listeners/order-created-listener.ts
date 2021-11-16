import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@amid3ntickets/common";

import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "..";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "tickets-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket, throw error
    if (!ticket) throw new Error("Ticket not found");

    // makr the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
