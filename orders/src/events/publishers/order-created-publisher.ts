import { Publisher, OrderCreatedEvent, Subjects } from "@amid3ntickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
