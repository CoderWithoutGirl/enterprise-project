const userRouter = require("express").Router();
const userController = require("../controller/user.controller");
const passport = require("passport");
const { uploadExcel } = require("../middleware/mutler");
const { authorize } = require("../middleware/authorization");
userRouter.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.QAMANAGER, process.env.ADMIN]),
  ],
  userController.getAllUser
);
userRouter.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.QAMANAGER, process.env.ADMIN]),
  ],
  userController.getUserById
);
userRouter.post(
  "/uploadexcel",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.QAMANAGER, process.env.ADMIN]),
    uploadExcel.single("file"),
  ],
  userController.uploadExcel
);
userRouter.get(
  "/confirm/:filename",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.QAMANAGER, process.env.ADMIN]),
  ],
  userController.createUserExcel
);
userRouter.get(
  "/cancel/:filename",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.QAMANAGER, process.env.ADMIN]),
  ],
  userController.cancelCreateUserByExcel
);

module.exports = userRouter;
