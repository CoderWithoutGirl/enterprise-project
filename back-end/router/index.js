const authenticateRouter = require('./authenticate.router');
const emailRouter = require('./email.router')
const rootRouter = require('express').Router();

rootRouter.use(`/auth`,authenticateRouter);
rootRouter.use(`/mail`,emailRouter);

module.exports = rootRouter;