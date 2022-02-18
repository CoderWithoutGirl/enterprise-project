const authenticateRouter = require('./authenticate.router');
const emailRouter = require('./email.router');
const departmentRouter = require('./department.router');
const userRouter = require('./user.router');
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);
rootRouter.use(`/mail`,emailRouter);
rootRouter.use(`/departments`,departmentRouter);
rootRouter.use(`/users`,userRouter);

module.exports = rootRouter;