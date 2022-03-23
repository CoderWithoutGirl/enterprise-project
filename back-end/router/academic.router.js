const academicRouter = require("express").Router();
const academicController = require("../controller/academic.controller");
const passport = require("passport");
const { authorize } = require("../middleware/authorization");

academicRouter.use([
  passport.authenticate("jwt", { session: false }),
  authorize([
    process.env.QAMANAGER,
    process.env.ADMIN,
    process.env.STAFF,
    process.env.QACOORDINATOR,
  ]),
]);

academicRouter.post(
  "/",
  academicController.create,
  authorize(process.env.ADMIN)
);
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
