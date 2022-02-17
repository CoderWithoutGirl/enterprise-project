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
        const newDep = new DepartmentModel(
            {
                name: "Staff Affair", description: "Manage student"
            });
        await newDep.save();
        const DepartmentInDB = await DepartmentModel.findOne({ name: "Staff Affair" });
        expect(DepartmentInDB).toBeTruthy();
    });

    it("Test create Departments with the same name of departments", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne({ name: "Staff Affair" });
        expect(checkDepartmentExistedInDb).toBeTruthy();
    });


    it("Test create Departments with name of departments is null", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne({ name: "" });
        expect(checkDepartmentExistedInDb).toBeFalsy();
    });

    it("Test create Departments with name of departments is longer than 50 characters", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne(
            {
                name: "Staffffffffffffffffffffffffffffffffffffffffffffffffffff"
            });
        expect(checkDepartmentExistedInDb).toBeFalsy();
    });

    it("Test create Departments with description of departments is longer than 200 characters", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne(
            {
                description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years."
            });
        expect(checkDepartmentExistedInDb).toBeFalsy();
    });

    afterAll(() => {
        mongoose.disconnect();
    })
});