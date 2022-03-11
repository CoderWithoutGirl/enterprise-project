const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const CategoryModel = require("../model/category")
const { 
    createCategory, 
    updateCategory,
    getCategory,
} = require('../service/category.service');


beforeAll(() => {
    db.connect("mongodb://localhost:27017/test-enterprise-project");
})

describe("POST /categories/", () => {

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

    it("Test create Category with name is longer than 50 characters", async () => {
        try {
            const newCategory = await createCategory(
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

});

describe("GET /categories/", () => {

    it("Test should return all category from database", async () => {
        const catogoryList = await getCategory()
        expect(catogoryList).toBeTruthy();
    });

});

describe("PUT /categories/:id", () => {
    it("Test should return update category description", async () => {
        const newCategory = new CategoryModel(
            {
                name: "AI", description: "No Problem"
            });
        await newCategory.save();
        const findCategory = await CategoryModel.findOne({ name: "AI"})
        console.log(findCategory);
        try {
            await updateCategory(findCategory._id, 'Very Hard');
        } catch (error) {
            expect(error).toBeFalsy();
        }

    })
});


afterAll(() => {
    mongoose.disconnect();
})
