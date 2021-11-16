import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@amid3ntickets/common";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "expiration-service";

  onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    
  }
}
