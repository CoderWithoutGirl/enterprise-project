const userRouter = require('express').Router();
const userController = require('../controller/user.controller');
const passport = require("passport");
const { authorize } = require("../middleware/authorization");
userRouter.get('/',[passport.authenticate('jwt', {session: false}), authorize([process.env.QAMANAGER, process.env.ADMIN])], userController.getAllUser);

module.exports = userRouter;