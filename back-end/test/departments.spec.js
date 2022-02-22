const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const DepartmentModel = require("../model/department")
const {
    searchDepartment,
    createDepartment,
    getAllDepartments,
    updateDepartment,
    findIdDepartment,

} = require('../service/department.service');

beforeAll(async () => {
    db.connect("mongodb://localhost:27017/test-enterprise-project");
    const newDep = new DepartmentModel(
        {
            name: "Staff Affair", description: "Manage student"
        });
    await newDep.save();
    const newDep1 = new DepartmentModel(
        {
            name: "Staff Affair1", description: "Manage student"
        });
    await newDep1.save();
    const newDep2 = new DepartmentModel(
        {
            name: "Staff Affair2", description: "Manage student"
        });
    await newDep2.save();
    const newDep3 = new DepartmentModel(
        {
            name: "Staff Affair3", description: "Manage student"
        });
    await newDep3.save();
    const newDep4 = new DepartmentModel(
        {
            name: "Staff Affair4", description: "Manage student"
        });
    await newDep4.save();
})

afterAll(async () => {
    await DepartmentModel.collection.drop();
    await mongoose.connection.close({ force: true });
})


describe("POST /departments/", () => {

    it("Test create Departments with correct value", async () => {
        const newDep = await createDepartment(
            {
                name: "Staff Affair8", description: "Manage student"
            });
        expect(newDep).toBeTruthy();
    });

    it("Test create Departments with the same name of departments", async () => {
        const checkDepartmentExistedInDb = await DepartmentModel.findOne({ name: "Staff Affair4" });
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
});

describe("GET /departments/", () => {

    it("Test should return all departments from database", async () => {
        const departmentList = await getAllDepartments()
        expect(departmentList).toBeTruthy();
    });

    it("Test should return department list order by asc", async () => {
        const departmentList = await getAllDepartments()
        let department1 = new Date(departmentList[1].createdAt);
        let department2 = new Date(departmentList[2].createdAt);
        expect(department1.getTime() <= department2.getTime()).toBe(true);
    });
});

describe("GET /departments?name", () => {
    it("Test should return department name", async () => {
        const department = await searchDepartment("Staff Affair2");
        expect(department.length > 0).toBeTruthy();
    })
});

describe("PUT /departments/:id", () => {
    it("Test should return update department description", async () => {
        const newDep5 = new DepartmentModel(
            {
                name: "Staff Accademic", description: "Manage student"
            });
        await newDep5.save();
        const findDepart = await DepartmentModel.findOne({ name: "Staff Accademic"})
        console.log(findDepart);
        try {
            await updateDepartment(findDepart._id, 'ManageAccademic');
        } catch (error) {
            expect(error).toBeFalsy();
        }

    })
});
