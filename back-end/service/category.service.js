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
module.exports = {createCategory, getCategory};