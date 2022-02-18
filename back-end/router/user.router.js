const userRouter = require('express').Router();
const userController = require('../controller/user.controller');

userRouter.get('/', userController.getAllUser);

module.exports = userRouter;