const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const User = require("../model/user");
const { getAllUser, getUserByUsername, getUserById} = require("../service/user.service")

beforeAll(async () => {
    db.connect("mongodb://localhost:27017/test-enterprise-project");
    const userTest1 = await new User({
        username: "user@gmail.com",
        password: "abc123",
        fullname: "user test 1",
        email: "user@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "male",
        role: process.env.QAMANAGER,
      });
      await userTest1.save();
      const userTest2 = await new User({
        username: "user2@gmail.com",
        password: "abc123",
        fullname: "user test 2",
        email: "user2@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "male",
        role: process.env.STAFF,
      });
      await userTest2.save();
      const userTest3 = await new User({
        username: "user3@gmail.com",
        password: "abc123",
        fullname: "user test 3",
        email: "user3@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "male",
        role: process.env.STAFF,
      });
      await userTest3.save();
})

afterAll(async () => {
    await mongoose.connection.close({force: true});
})

describe("GET /users/", () => {
    

    it("Test should return first member user must be qa manager", async() =>{
        const userList = await getAllUser();
        console.log(userList);
        expect(userList[0].role === process.env.QAMANAGER).toBeTruthy();
    })

    it("Test should return second member user must be staff", async() =>{
        const userList = await getAllUser();
        console.log(userList);
        expect(userList[1].role === process.env.STAFF).toBeTruthy();
    })

    it("Test should return staff list order by asc", async() =>{
        const userList = await getAllUser();
        let user1 = new Date(userList[1].createdAt);
        let user2 = new Date(userList[2].createdAt);
        expect(user1.getTime() < user2.getTime()).toBe(true);
    })
});

describe("GET /users?username", () => {
    it("Test should return admin user", async() =>{
        const user = await getUserByUsername("user3@gmail.com");
        expect(user.length > 0).toBeTruthy();
    })
});

describe("GET /users/:id", () => {
    it("Test should return user details", async() =>{
        const userAdmin = await getUserByUsername("user@gmail.com");
        const user = await getUserById(userAdmin);
        expect(user).toBeTruthy();
    })
});

