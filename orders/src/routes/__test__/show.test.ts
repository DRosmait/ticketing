import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { Ticket } from "../../models";

describe("show.ts", () => {
  it("fetches the order", async () => {
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

    const response = await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(order.ticket.id);
  });

  it("return an error if one user tries to fetch another users order", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "ticket 1",
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", global.signin())
      .send()
      .expect(401);
  });
});
