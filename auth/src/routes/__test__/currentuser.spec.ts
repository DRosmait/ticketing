import request from "supertest";

import app from "../../app";

describe("currentuser.ts", () => {
  it("responds with details about the current suer", async () => {
    const [_, cookie] = await global.signin();

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
  });

  it("responds with null if not authentickated", async () => {
    const response = await request(app)
      .get("/api/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull();
  });
});
