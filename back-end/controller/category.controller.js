const {createCategory,getCategory,  getCategoryByName} = require('../service/category.service');

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
    },

    getCategory: async (req,res) => {

        const name = req.query.name;
        if(name){
            const result = await getCategoryByName(name);
            res.status(200).json(result);
        } 
        else{
            const results = await getCategory();
            res.status(200).json({
                data: results
            })
        }
        // try {
        //     const results = await getCategory();
        //     res.status(200).json({
        //         data: results
        //     })
        // } catch (error) {
        //     res.status(500).json({
        //         message: error.message
        //     });
        //     next(error)
        // }
    }


}

module.exports=categoryController;