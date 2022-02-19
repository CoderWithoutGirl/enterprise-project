const departmentRouter = require('express').Router(); 
const { createDepartment } = require('../controller/department.controller');
const passport = require('passport');
const {authorize} = require('../middleware/authorization')

departmentRouter.post('/', [passport.authenticate('jwt', {session: false}), authorize(process.env.QAMANAGER)],createDepartment);

module.exports = departmentRouter;