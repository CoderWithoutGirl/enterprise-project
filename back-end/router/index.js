const authenticateRouter = require('./authenticate.router');
const emailRouter = require('./email.router');
const userRouter = require('./user.router');
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);
rootRouter.use(`/mail`,emailRouter);
rootRouter.use(`/user`,userRouter);

module.exports = rootRouter;