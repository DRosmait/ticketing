import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@amid3ntickets/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = "orders-service";

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Completed });
    await order.save();

    msg.ack();
  }
}
