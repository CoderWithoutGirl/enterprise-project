const ideaRouter = require('express').Router();
const {uploadDocument} = require('../middleware/mutler')
const {
  uploadSupportDocument,
  createIdeaWithDocument,
  createDocumentSupportedFromEditor,
  getAllIdeas,
} = require("../controller/idea.controller");
const passport = require('passport');
const {authorize} = require('../middleware/authorization')

//ideaRouter.use([passport.authenticate('jwt', {session: false}), authorize()])
ideaRouter.get("/", getAllIdeas);
ideaRouter.post('/create', createIdeaWithDocument);
ideaRouter.post('/document-create', uploadDocument.single("editor-content"), createDocumentSupportedFromEditor);
ideaRouter.post(
  "/upload",
  uploadDocument.single("document"),
  uploadSupportDocument
);

module.exports = ideaRouter