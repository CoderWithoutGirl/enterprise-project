const { createDepartment } = require('../service/department.service');

const departmentController = {
    createDepartment: async (req, res) => {
        const defaultDepartment = req.body;
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
    }
}

module.exports = departmentController;

