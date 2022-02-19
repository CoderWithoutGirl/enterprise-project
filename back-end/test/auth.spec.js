const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");
const app = require("../app");

describe("POST /auth/login", () => {
  //
  it("Should return JWT token and refreshToken", async () => {
    const requestBody = {
      username: "admin",
      password: "admin@123",
    };
    const response = await request(app)
      .post("/api/auth/login")
      .send(requestBody);
      //
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
  });
});

describe("POST /auth/register", () => {
  //
  it("Should return success create new user", async () => {
    const requestBody = {
      gender: "male",
      dateOfBirth: "2021-02-09T17:00:00.000Z",
      address: "test stress",
      age: 30,
      confirmPassword: "Test12345@",
      password: "Test12345@",
      username: "test@test.com",
      fullname: "Nguyen van test"
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(requestBody);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.roles === "staff")
  });
});