import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import natsWrapper from "../../nats-wrapper";
import { Ticket, Order, OrderStatus } from "../../models";

describe("delete.ts", () => {
  it("marks an order as canceled", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "ticket 1",
      price: 20,
    });
    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete("/api/orders/" + order.id)
      .set("Cookie", user)
      .send()
      .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
  });

  it("emits an order deleted event", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "ticket 1",
      price: 20,
    });
    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete("/api/orders/" + order.id)
      .set("Cookie", user)
      .send()
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
