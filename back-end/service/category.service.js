const Category = require("../model/category");

const createCategory = async (defaultCategory) => {
    const {name} = defaultCategory;

    if (name === ""){
        throw new Error("Name of Category is required")
        return;
    }

    const checkCategoryExistedInDb = await Category.findOne({name});
    if (checkCategoryExistedInDb){
        throw new Error("Category already exists");
        return;
    }  
    else{
        const createCategory = new Category({ ...defaultCategory});
        await createCategory.save();
        return createCategory;
    }
}

const getCategory= async () =>{
    let result = await Category.find({});
    return result;
}

const getCategoryByName = async (name) => {
    const filterCategory = await Category.find().sort([["createdAt", "asc"]]);
    const results = filterCategory.filter(item => item.name.includes(name));
    return results;
}

const findIdCategory = async (id) =>{
    const categoryDb = await Category.findById(id);
    if(!categoryDb){
        throw new Error("Category does not exist");
    }
    return categoryDb;

}

const updateCategory = async(id, description) =>{
    await Category.findByIdAndUpdate(id , {description: description});
}

const deleteCategory = async (id) =>{
    await Category.findByIdAndDelete(id);
}

module.exports = {
    createCategory, 
    getCategory, 
    getCategoryByName,
    findIdCategory,
    updateCategory,
    deleteCategory,
};