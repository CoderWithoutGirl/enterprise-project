const userRouter = require('express').Router();
const userController = require('../controller/user.controller');

userRouter.get('/getalluser', userController.getAllUser);
userRouter.post('/searchuserbyusername', userController.searchUserByUsername);

module.exports = userRouter;