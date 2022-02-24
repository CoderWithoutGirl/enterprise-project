const categoryRouter = require('express').Router();

const { 
    createCategory, 
    getCategory,
    updateCategory, 
    getOneCategoryById
} = require('../controller/category.controller');

const passport = require('passport');
const {authorize} = require('../middleware/authorization')

categoryRouter.use([passport.authenticate('jwt', {session: false}), authorize(process.env.ADMIN)])
categoryRouter.post('/', createCategory);
categoryRouter.get('/',getCategory);
categoryRouter.put('/:id' , updateCategory);
categoryRouter.get('/:id',  getOneCategoryById);



module.exports = categoryRouter;
