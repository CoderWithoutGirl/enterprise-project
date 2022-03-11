const ideaRouter = require('express').Router({mergeParams: true});
const {uploadDocument} = require('../middleware/mutler')
const {
  uploadSupportDocument,
  createIdeaWithDocument,
  createDocumentSupportedFromEditor,
  getAllIdeas,
  getSingleIdea,
  commentToIdea,
  reactionToIdea,
  inscreaseViewOfIdea,
} = require("../controller/idea.controller");
const passport = require('passport');
const {authorize} = require('../middleware/authorization')

ideaRouter.use([passport.authenticate('jwt', {session: false}), authorize()])
ideaRouter.get("/", getAllIdeas);
ideaRouter.get("/:id", getSingleIdea);
ideaRouter.post("/:id/comment", commentToIdea);
ideaRouter.get("/:id/view", inscreaseViewOfIdea);
ideaRouter.post("/:id/reaction", reactionToIdea);
ideaRouter.post('/create', createIdeaWithDocument);
ideaRouter.post('/document-create', uploadDocument.single("editor-content"), createDocumentSupportedFromEditor);
ideaRouter.post(
  "/upload",
  uploadDocument.single("document"),
  uploadSupportDocument
);

module.exports = ideaRouter