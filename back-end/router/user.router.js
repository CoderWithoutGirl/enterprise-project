const userRouter = require('express').Router();
const userController = require('../controller/user.controller');
const passport = require("passport");
const { authorize } = require("../middleware/authorization");

userRouter.get('/',[passport.authenticate('jwt', {session: false}), authorize([process.env.QAMANAGER, process.env.ADMIN])], userController.getAllUser);
userRouter.get('/:id',[passport.authenticate('jwt', {session: false}), authorize([process.env.QAMANAGER, process.env.ADMIN])], userController.getUserById);
userRouter.put('/:id',[passport.authenticate('jwt', {session: false}), authorize(process.env.ADMIN)], userController.assignStaff);

module.exports = userRouter;