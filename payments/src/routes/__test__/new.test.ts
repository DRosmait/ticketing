import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { Order, Payment } from "../../models";
import { OrderStatus } from "@amid3ntickets/common";
import { stripe } from "../../stripe";
import { isModuleBlock } from "typescript";

jest.mock("../../stripe");

describe("new.ts", () => {
  it("returns a 404 when purchasing an order that does not exist.", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        token: "some_token",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it("returns a 401 when purchasing an order that does not belong to the user", async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      price: 20,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        token: "some_token",
        orderId: order.id,
      })
      .expect(401);
  });

  it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      status: OrderStatus.Canceled,
      version: 0,
      price: 20,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({
        token: "some_token",
        orderId: order.id,
      })
      .expect(400);
  });

  it("returns a 204 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      status: OrderStatus.Created,
      version: 0,
      price: 20,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({
        token: "tok_visa",
        orderId: order.id,
      })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currancy).toEqual("eur");

    const payment = await Payment.findOne({
      orderId: order.id,
    });

    expect(payment).not.toBeNull();
  });
});
