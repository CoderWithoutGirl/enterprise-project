const authenticateRouter = require('./authenticate.router');
const emailRouter = require('./email.router');
const departmentRouter = require('./department.router');
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);
rootRouter.use(`/mail`,emailRouter);
rootRouter.use(`/departments`,departmentRouter);

module.exports = rootRouter;