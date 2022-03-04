const categoryRouter = require('express').Router();

const { 
    createCategory, 
    getCategory,
    updateCategory, 
    getOneCategoryById
} = require('../controller/category.controller');

const passport = require('passport');
const {authorize} = require('../middleware/authorization')

categoryRouter.use([passport.authenticate('jwt', {session: false})])
categoryRouter.post('/', authorize(process.env.ADMIN), createCategory);
categoryRouter.get('/',getCategory);
categoryRouter.put('/:id' , authorize(process.env.ADMIN), updateCategory);
categoryRouter.get('/:id', authorize(process.env.ADMIN), getOneCategoryById);



module.exports = categoryRouter;
