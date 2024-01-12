import request from "supertest";
import app from "../../app";

describe("Authentication", () => {
  describe("login api route", () => {
    describe("given the valid credentials", () => {
      it("should return 200 success", async () => {
        const response = await request(app)
          .post("/api/auth/signin")
          .send({ email: "umer@test.com", password: "123456789" });
        expect(response.status).toBe(200);
      });
    });

    describe("given the invalid credentials", () => {
      it("should return 401", async () => {
        const response = await request(app)
          .post("/api/auth/signin")
          .send({ email: "invalid@email.com", password: "invalidPass" });
        expect(response.status).toBe(401);
      });
    });

    describe("given the missing request data", () => {
      it("should return 400", async () => {
        const response = await request(app).post("/api/auth/signin").send({});

        expect(response.status).toBe(400);
      });
    });
  });
});
