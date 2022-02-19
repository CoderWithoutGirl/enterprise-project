const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const CategoryModel = require("../model/category")
const { createCategory } = require('../service/category.service');

describe("POST /categories/", () => {

    beforeAll(() => {
        db.connect("mongodb://localhost:27017/test-enterprise-project");
    })

    it("Test create Category with correct value", async () => {
        const newCategory = await createCategory(
            {
                name: "Blockchain", description: "Easy"
            });

        expect(newCategory).toBeTruthy();
    });

    it("Test create Category with the name existed", async () => {
        const checkCategoryExistedInDb = await CategoryModel.findOne({ name: "Blockchain" });
        expect(checkCategoryExistedInDb).toBeTruthy();
    });


    it("Test create Category with name of category is null", async () => {
        try {
            const newCategory = await createCategory(
                {
                    name: ""
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it("Test create Departments with name of departments is longer than 50 characters", async () => {
        try {
            const newCategory = await createDepartment(
                {
                    name: "Machine Learning Machine Learning Machine Learning Machine Learning"
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }

    });

    it("Test create Category with description is longer than 200 characters", async () => {
        try {
            const newCategory = await createCategory(
                {
                    description: "Machine learning is the science of getting computers to act without being explicitly programmed. In the past decade, machine learning has given us self-driving cars, practical speech recognition, effective web search"
                });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    afterAll(() => {
        mongoose.disconnect();
    })
});