import request from "supertest";

import app from "../../app";

describe("signup.ts", () => {
  it("return 201 on successful signup", async () => {
    await global.signin();
  });

  it("returns a 400 with an invalid email", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "p",
      })
      .expect(400);
  });

  it("returns a 400 with missing email and password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com" })
      .expect(400);

    await request(app)
      .post("/api/users/signup")
      .send({ password: "password" })
      .expect(400);
  });

  it("disallows duplicate eamils", async () => {
    await global.signin();

    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(400);
  });

  it("sets a cookie with JWT after successful sing up", async () => {
    const [response] = await global.signin();

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
