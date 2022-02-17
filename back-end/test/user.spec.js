const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");
const app = require("../app");

describe("GET /users/", () => {
  //
  it("Should return list all user", async () => {
    const response = await request(app)
      .get("/api/users/")
      
    expect(response.statusCode).toBe(200);
    expect(response.body[0].roles==="qamanager");
    expect(response.body[1].createdAt >  response.body[2].createdAt);

  });
});

describe("POST /users/search", () => {

    it("Should return user need to find", async () => {
      const response = await request(app)
        .get("/api/users/search?username=admin")
        
      expect(response.statusCode).toBe(200);
      expect(response.body.username==="admin");
      
    });
  });