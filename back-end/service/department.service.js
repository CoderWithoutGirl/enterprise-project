const Department = require("../model/department");
const IdeaModel = require("../model/idea");
const UserModel = require("../model/user")

const createDepartment = async (defaultDepartment) => {
    const { name } = defaultDepartment;
    if(name === ""){
        throw new Error("Name of Departments is required");
        return;
    }
    const checkDepartmentExistedInDb = await Department.findOne({ name });
    if (checkDepartmentExistedInDb) {
        throw new Error("Department already exists");
        return;
    } else {
        const createDepartment = new Department({ ...defaultDepartment });
        await createDepartment.save();
        return createDepartment;
    }
};

const getAllDepartments = async () =>{
    const departmentDB = await Department.find({deleted: false} ).sort([["createdAt", "asc"]]);
    return [...departmentDB];
}

const searchDepartment = async (name) => {
    const listDepartInDb = await Department.find({deleted: false}).sort([["createdAt", "asc"]]);
    const dataFiltering = listDepartInDb.filter((item) => item.name.includes(name));
    return dataFiltering;
}

const findIdDepartment = async (id) =>{
    const departmentDb = await Department.findById(id, {deleted: false});
    if(!departmentDb){
        throw new Error("Department does not exist");
    }
    return departmentDb;
}

const deleteDepartment = async (id) =>{
    const getDepartment = await findIdDepartment(id);
    const checkDepartmentUsed = await UserModel.find({department:getDepartment.name})
    const checkDepartmentAtIdea = await IdeaModel.find({department:getDepartment.name})

    console.log(checkDepartmentUsed);
    await Department.findByIdAndUpdate(id , {deleted: true});
    if (checkDepartmentUsed){
        await UserModel.updateMany({department: getDepartment.name},{ department: "" })
    }
    
    if (checkDepartmentAtIdea){
        await IdeaModel.updateMany({department: getDepartment.name},{ department: "" })
    }
    canDelete = true;
    return canDelete;
}

const updateDepartment = async(id, description) =>{
    await Department.findByIdAndUpdate(id , {description: description});
}

module.exports = { 
    createDepartment, 
     getAllDepartments, 
     findIdDepartment, 
     deleteDepartment, 
     updateDepartment, 
     searchDepartment
};

