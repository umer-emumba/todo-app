import request from "supertest";
import app from "../../app";
import { config, generateJWT } from "../../utils";
import { TokenType, UserType } from "../../interfaces/IJwtToken";

describe("Tasks", () => {
  describe("tasks listing api route", () => {
    describe("given the user is logged in", () => {
      it("should return 200 success", async () => {
        const token = generateJWT(
          {
            id: 4,
            token_type: TokenType.ACCESS,
            user_type: UserType.USER,
          },
          config.jwt.accessTokenExpiry
        );
        const response = await request(app)
          .get("/api/tasks")
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
      });
    });
  });
});
