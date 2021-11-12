import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import natsWrapper from "../../nats-wrapper";

describe("update.ts", () => {
  it("returns 404 if the provided ID does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put("/api/tickets/" + id)
      .set("Cookie", global.signin())
      .send({ title: "ticket", price: 10 })
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put("/api/tickets/" + id)
      .send({ title: "ticket", price: 10 })
      .expect(401);
  });

  it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "ticket", price: 20 })
      .expect(201);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", global.signin())
      .send({ title: "Updated ticket", price: 1000 })
      .expect(401);
  });

  it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "ticket", price: 20 })
      .expect(201);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ title: "new name", price: -1 })
      .expect(400);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ title: "", price: 12 })
      .expect(400);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ price: 20 })
      .expect(400);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ title: "New title" })
      .expect(400);
  });

  it("updates the ticket provided valid inputs", async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "Ticket", price: 10 })
      .expect(201);

    const newTitle = "Some new title";
    const newPrice = 999;

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    const ticketResponse = await request(app)
      .get("/api/tickets/" + response.body.id)
      .send();

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
  });

  it("publishes an event", async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      })
      .expect(201);

    await request(app)
      .put("/api/tickets/" + response.body.id)
      .set("Cookie", cookie)
      .send({ title: "some new title", price: 999 })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  });
});
