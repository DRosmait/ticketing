import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models";
import natsWrapper from "../../nats-wrapper";

describe("new.ts", () => {
  it("has a route handler listening on /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("return an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        price: 10,
      })
      .expect(400);
  });
  it("return an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "ticket",
        price: -10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "ticket",
      })
      .expect(400);
  });
  it("creates a ticket with valid inputs", async () => {
    const title = "ticket";
    const price = 10;

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);
  });

  it("publishes an event", async () => {
    const title = "some title";

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title,
        price: 20,
      });

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
