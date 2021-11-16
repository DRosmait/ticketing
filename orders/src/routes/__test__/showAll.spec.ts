import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { Ticket } from "../../models";

describe("showAll.ts", () => {
  it("fetches orders for a particular user.", async () => {
    const tickets = [
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "ticket 1",
        price: 10,
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "ticket 2",
        price: 20,
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "ticket 3",
        price: 30,
      },
    ].map((attrs) => Ticket.build(attrs));
    tickets.forEach(async (ticket) => await ticket.save());

    const userOne = global.signin();
    const userTwo = global.signin();

    // user one order
    await request(app)
      .post("/api/orders")
      .set("Cookie", userOne)
      .send({
        ticketId: tickets[0].id,
      })
      .expect(201);

    // user two order
    const { body: orderOne } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({
        ticketId: tickets[1].id,
      })
      .expect(201);
    const { body: orderTwo } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({
        ticketId: tickets[2].id,
      })
      .expect(201);

    // get orders for user two
    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", userTwo)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(tickets[1].id);
    expect(response.body[1].ticket.id).toEqual(tickets[2].id);
  });
});
