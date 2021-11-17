import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@amid3ntickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
