const {createCategory,getCategory,getAllIdeaWithCategoryName,  getCategoryByName, findIdCategory, updateCategory, deleteCategory} = require('../service/category.service');

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
            res.status(200).json(results)
        }
    },
    getAllIdeaInCategory: async (req, res) => {
        const {name} = req.params;
        const {title} = req.query;
        const data = await getAllIdeaWithCategoryName(name, title);
        res.status(200).json({data})
    },

    getOneCategoryById: async (req, res) =>{
        const { id } = req.params;
        try {
            res.status(200).json({data: await findIdCategory(id)})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },

    updateCategory: async (req, res) =>{
        const { id } = req.params;
        const { description } = req.body;
        try {
            await updateCategory(id, description);
            res.status(200).json({message: 'Update Category Successfully.'})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },

    deleteCategory : async (req, res) =>{
        const { id } = req.params;
        try {
            await deleteCategory(id);
            res.status(200).json({message: 'Delete Category Successfully.'})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },


}

module.exports=categoryController;