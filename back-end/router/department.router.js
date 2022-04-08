const departmentRouter = require('express').Router(); 
const { 
    createDepartment, 
    getAllDepartments, 
    deleteDepartment,
    updateDepartment,
    getOneDepartmentById,
    reactive
} = require('../controller/department.controller');

const passport = require('passport');
const {authorize} = require('../middleware/authorization')

departmentRouter.use([passport.authenticate('jwt', {session: false}), authorize([process.env.QAMANAGER, process.env.ADMIN])])
departmentRouter.get('/',  getAllDepartments);
departmentRouter.get('/:id',  getOneDepartmentById);
departmentRouter.get("/reactive/:id", reactive);
departmentRouter.post('/', createDepartment);
departmentRouter.delete('/:id', deleteDepartment);
departmentRouter.put('/:id' , updateDepartment);

module.exports = departmentRouter;