const authenticateRouter = require('./authenticate.router');
const emailRouter = require('./email.router');
const departmentRouter = require('./department.router');
const categoryRouter = require('./category.router')
const userRouter = require('./user.router');
const testRouter = require('./test.router');
const subRoute = require('./subRoute.router');
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);
rootRouter.use(`/mail`,emailRouter);
rootRouter.use(`/departments`,departmentRouter);
rootRouter.use(`/categories`,categoryRouter);
rootRouter.use(`/users`,userRouter);
rootRouter.use(`/test`, testRouter);
rootRouter.use('/sub-route', subRoute);

module.exports = rootRouter;