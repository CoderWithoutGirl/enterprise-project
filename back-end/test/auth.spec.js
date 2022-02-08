const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");
const app = require("../app");

describe("POST /auth/login", () => {
  it("Should return JWT token and refreshToken", async () => {
    const requestBody = {
      username: "admin",
      password: "admin@123",
    };
    const response = await request(app)
      .post("/api/auth/login")
      .send(requestBody);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
  });
});
