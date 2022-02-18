const departmentRouter = require('express').Router(); 
const { createDepartment } = require('../controller/department.controller');

departmentRouter.post('/', createDepartment);

module.exports = departmentRouter;