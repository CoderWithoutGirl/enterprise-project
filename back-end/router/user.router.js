const userRouter = require('express').Router();
const userController = require('../controller/user.controller');

userRouter.get('/', userController.getAllUser);
userRouter.get('/search', userController.searchUserByUsername);

module.exports = userRouter;