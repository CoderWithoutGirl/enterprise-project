const Category = require("../model/category");
const IdeaModel = require("../model/idea")
const UserModel = require("../model/user")

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

const getAllIdeaWithCategoryName = async (name) => {
    return await Category.findOne({name}).populate({path: 'ideas', populate: {path: 'user'}});
}

const updateCategory = async(id, description) =>{
    await Category.findByIdAndUpdate(id , {description: description});
}



const checkCategoryInUsed = async(id) =>{
    const checkCategoryUsed = await IdeaModel.find({category:id})
    return checkCategoryUsed.length > 0 ? true : false;
    
}

const deleteCategory = async (id) =>{
    const checkUsed = await checkCategoryInUsed(id);
    if (checkUsed){
        throw new Error("Category used. Please don't delete it");
    }
    else{
        const canDelete = await Category.findByIdAndDelete(id);
        return canDelete;
    }
}
    

module.exports = {
  createCategory,
  getCategory,
  getCategoryByName,
  findIdCategory,
  updateCategory,
  deleteCategory,
  getAllIdeaWithCategoryName,
};