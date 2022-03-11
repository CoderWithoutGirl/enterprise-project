const Department = require("../model/department");

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
    const departmentDB = await Department.find().sort([["createdAt", "asc"]]);
    return [...departmentDB];
}

const searchDepartment = async (name) => {
    const listDepartInDb = await Department.find().sort([["createdAt", "asc"]]);
    const dataFiltering = listDepartInDb.filter((item) => item.name.includes(name));
    return dataFiltering;
}

const findIdDepartment = async (id) =>{
    const departmentDb = await Department.findById(id);
    if(!departmentDb){
        throw new Error("Department does not exist");
    }
    return departmentDb;

}

const deleteDepartment = async (id) =>{
    await Department.findByIdAndDelete(id);
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

