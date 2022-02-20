const { createDepartment, getAllDepartments } = require('../service/department.service');

const departmentController = {
    createDepartment: async (req, res) => {
        const defaultDepartment = req.body;
        console.log(defaultDepartment);
        try {
            const newDepartment = await createDepartment(defaultDepartment);
            res.status(201).json({
                message: "Department created successfully",
                status: 201,  
                department: newDepartment,
            });
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },
    
    getAllDepartments : async (req, res) =>{
        const department = await getAllDepartments();
        res.status(200).json(department);
    }
}

module.exports = departmentController;

