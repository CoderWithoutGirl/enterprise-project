const categoryRouter = require('express').Router();

const { createCategory, getCategory } = require('../controller/category.controller');

categoryRouter.post('/', createCategory);
categoryRouter.get('/',getCategory);

module.exports = categoryRouter;
