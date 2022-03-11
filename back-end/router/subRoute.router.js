const subRoute = require('express').Router();
const {getAllSubRoute} = require('../controller/subRoute.controller')

subRoute.get('/', getAllSubRoute)

module.exports = subRoute;