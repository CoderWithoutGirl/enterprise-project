const authenticateRouter = require('express').Router();
const {
  login,
  register,
  refeshToken,
  logout
} = require("../controller/authenticate.controller");
const passport = require('passport');

authenticateRouter.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    res.send("Hello");
})

authenticateRouter.post('/login', 
passport.authenticate('local', {session: false}),
login);

authenticateRouter.get("/refresh-token", refeshToken);

authenticateRouter.post('/register', register);

authenticateRouter.post("/logout", logout);

module.exports = authenticateRouter;