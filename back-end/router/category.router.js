const categoryRouter = require('express').Router();

const { 
    createCategory, 
    getCategory,
    updateCategory, 
    getOneCategoryById,
    deleteCategory,
    getAllIdeaInCategory
} = require('../controller/category.controller');

const passport = require('passport');
const {authorize} = require('../middleware/authorization')

categoryRouter.use([passport.authenticate('jwt', {session: false})])
categoryRouter.post(
  "/",
  authorize([process.env.ADMIN, process.env.QAMANAGER]),
  createCategory
);
categoryRouter.get('/',getCategory);
categoryRouter.get("/ideas/:name", getAllIdeaInCategory);
categoryRouter.put('/:id' , authorize([process.env.ADMIN, process.env.QAMANAGER]), updateCategory);
categoryRouter.put(
  "/:id",
  authorize([process.env.ADMIN, process.env.QAMANAGER]),
  updateCategory
);
categoryRouter.get(
  "/:id",
  authorize([process.env.ADMIN, process.env.QAMANAGER]),
  getOneCategoryById
);
categoryRouter.delete('/:id',authorize([process.env.ADMIN, process.env.QAMANAGER]), deleteCategory);


module.exports = categoryRouter;
