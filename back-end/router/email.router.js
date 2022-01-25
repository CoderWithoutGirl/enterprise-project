const emailRouter = require('express').Router();
const emailController = require('../controller/email.controller');

emailRouter.post('/send', emailController.sendMail)

module.exports = emailRouter