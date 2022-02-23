const categoryRouter = require('express').Router();

const { 
    createCategory, 
    getCategory,
    updateCategory, 
} = require('../controller/category.controller');

categoryRouter.post('/', createCategory);
categoryRouter.get('/',getCategory);
categoryRouter.put('/:id' , updateCategory);

module.exports = categoryRouter;
