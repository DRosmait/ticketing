import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@amid3ntickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
