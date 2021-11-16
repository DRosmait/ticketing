import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@amid3ntickets/common";
import { expirationQueue } from "../../queues";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "expiration-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}
