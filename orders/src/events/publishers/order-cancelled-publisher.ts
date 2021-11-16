import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@amid3ntickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
