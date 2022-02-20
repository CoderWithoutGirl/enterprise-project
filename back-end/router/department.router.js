const departmentRouter = require('express').Router(); 
const { createDepartment, getAllDepartments } = require('../controller/department.controller');

const passport = require('passport');
const {authorize} = require('../middleware/authorization')

departmentRouter.post('/', [passport.authenticate('jwt', {session: false}), authorize(process.env.QAMANAGER)], createDepartment);
departmentRouter.get('/', [passport.authenticate('jwt', {session: false}), authorize(process.env.QAMANAGER)], getAllDepartments);

module.exports = departmentRouter;