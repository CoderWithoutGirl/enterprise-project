const {createCategory} = require('../service/category.service');

const categoryController = {
    createCategory: async (req,res) => {
        const defaultCategory = req.body;
        console.log(defaultCategory);
        try {
            const newCategory = await createCategory(defaultCategory);
            res.status(201).json({
                message: "Category created successfully",
                status: 201,
                category: newCategory,
            });
        } 
        catch (error) {
            res.status(400).json({
                message: error.message,
                status: 400,
            });
        }
    }
}

module.exports=categoryController;