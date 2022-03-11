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
academicRouter.put(
  "/:id",
  authorize(process.env.ADMIN),
  academicController.update
);
academicRouter.get(
  "/:id",
  authorize(process.env.ADMIN),
  academicController.getById
);

module.exports = academicRouter;
