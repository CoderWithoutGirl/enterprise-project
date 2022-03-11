const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const UserModel = require("../model/user")
const { register } = require("../service/auth.service");
const DepartmentModel = require("../model/department");
const {
    createDepartment,

} = require('../service/department.service');

describe("POST /auth/register", () => {

    beforeAll(async () => {
        db.connect("mongodb://localhost:27017/test-enterprise-project");
    })

    it("Test create user with correct value", async () => {
        const newUser = await register({
            "gender": "male",
            "dateOfBirth": "2021-02-09T17:00:00.000Z",
            "address": "test stress",
            "age": 30,
            "confirmPassword": "Test12345@",
            "password": "Test12345@",
            "username": "testcorrect@test.com",
            "fullname": "Nguyen van test"
        });
        console.log(newUser);
        expect(newUser).toBeTruthy();
    });

    it("Test create user with the same username", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testcorrect@test.com",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }

    });

    it("Test create user with password and confirm password not match", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "Test123456@",
                "password": "Test12345@",
                "username": "testpassword@test.com",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }

    });

    it("Test create user with not strong password", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "test12",
                "password": "test12",
                "username": "testpasswordstrong@test.com",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }

    });

    it("Test create user with username is not email address", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "test12",
                "password": "test12",
                "username": "testemail",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }

    });

    it("Test create user with gender is null", async () => {
        try {
            const newUser = await register({
                "gender": "",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testgender@test.com",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it("Test create user with date of birth is null", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testdateofbirth@test.com",
                "fullname": "Nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it("Test create user with fullname is null", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 30,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testfullname@test.com",
                "fullname": ""
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it("Test create user with age out of range", async () => {
        try {
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "2021-02-09T17:00:00.000Z",
                "address": "test stress",
                "age": 200,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testage@test.com",
                "fullname": "nguyen van test"
            });
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it("Test assign Staff's account to department", async () => {
        try {
            const newDep = await createDepartment(
                {
                    name: "Staff Affair8", description: "Manage student"
                });
            const newUser = await register({
                "gender": "male",
                "dateOfBirth": "20000-05-19T17:00:00.000+00:00",
                "address": "test stress",
                "age": 200,
                "confirmPassword": "Test12345@",
                "password": "Test12345@",
                "username": "testage@test.com",
                "fullname": "nguyen van test",
                "department": "Staff Affair8"
            });
            expect(newUser.department).toEqual(newDep.name);
        } catch (e) {
            expect(e).toBeTruthy();
        }
    })

    afterAll(() => {
        mongoose.disconnect();
    })

});