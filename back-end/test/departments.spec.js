const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const DepartmentModel = require("../model/department")
const { createDepartment } = require('../service/department.service');

describe("POST /departments/", () => {

    beforeAll(() => {
        db.connect("mongodb://localhost:27017/test-enterprise-project");
    })

    it("Test create Departments with correct value", async () => {
        const newDep = await createDepartment(
            {
                name: "Staff Affair1", description: "Manage student"
            });

        expect(newDep).toBeTruthy();
    });

    it("Test create Departments with the same name of departments", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne({ name: "Staff Affair1" });
        expect(checkDepartmentExistedInDb).toBeTruthy();
    });


    it("Test create Departments with name of departments is null", async () => {
        try {
            const newDep = await createDepartment(
                {
                    name: ""
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it("Test create Departments with name of departments is longer than 50 characters", async () => {
        try {
            const newDep = await createDepartment(
                {
                    name: "Staffffffffffffffffffffffffffffffffffffffffffffffff"
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }

    });

    it("Test create Departments with description of departments is longer than 200 characters", async () => {
        try {
            const newDep = await createDepartment(
                {
                    description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years."
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    afterAll(() => {
        mongoose.disconnect();
    })
});