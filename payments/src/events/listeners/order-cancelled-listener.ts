import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@amid3ntickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = "payments-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findById({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    msg.ack();
  }
}
