const categoryRouter = require('express').Router();

const {createCategory} = require('../controller/category.controller');

categoryRouter.post('/', createCategory);

module.exports = categoryRouter;
