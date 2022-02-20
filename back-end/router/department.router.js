const departmentRouter = require('express').Router(); 
const { createDepartment, getAllDepartments } = require('../controller/department.controller');

departmentRouter.post('/', createDepartment);
departmentRouter.get('/', getAllDepartments);

module.exports = departmentRouter;