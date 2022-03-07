const academicRouter = require("express").Router();
const academicController = require("../controller/academic.controller");
const passport = require("passport");
const { authorize } = require("../middleware/authorization");

academicRouter.use([
  passport.authenticate("jwt", { session: false }),
  authorize([process.env.QAMANAGER, process.env.ADMIN]),
]);

academicRouter.post("/", academicController.create);
academicRouter.get("/", academicController.getAll);

module.exports = academicRouter;
