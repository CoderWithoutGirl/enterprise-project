const {
  getFileUrl,
  createIdea,
  createDocumentFromMarkdown,
  getAllIdeaWithFilter,
  countAllIdeas,
  getIdeaById,
  commentToAnIdea,
  reactionToAnIdea,
} = require("../service/idea.service");

const getAllIdeas = async (req, res) => {
  const { filter, page } = req.query;
  const pages = await countAllIdeas();
  const allIdeas = await getAllIdeaWithFilter(filter, page);
  res.status(200).json({ pages, data: allIdeas });
};

const getSingleIdea = async (req, res) => {
  const { id } = req.params;
  const data = await getIdeaById(id);
  res.status(200).json({ data });
};

const commentToIdea = async (req, res) => {
  const { userId, content } = req.body;
  const { id } = req.params;

  await commentToAnIdea(id, content, userId);
  res.status(201).json({ message: "comment success" });
};
const reactionToIdea = async (req, res) => {
  const { userId, reactionType } = req.body;
  const { id } = req.params;

  await reactionToAnIdea(id, reactionType, userId);
  res.status(201).json({ message: "react success" });
};

const createIdeaWithDocument = async (req, res) => {
  const { title, description, documentLink, category } = req.body;
  const userId = req?.user?._id || null;
  const createdIdea = await createIdea(
    title,
    description,
    documentLink,
    category,
    userId
  );
  res.status(201).json({ message: "Idea Created", data: createdIdea });
};

const uploadSupportDocument = async (req, res) => {
  const filename = req.file.filename;
  const documentLink = getFileUrl(filename);
  res.status(201).json({ documentLink });
};

const createDocumentSupportedFromEditor = async (req, res) => {
  const filename = req.file.filename;
  const documentLink = await createDocumentFromMarkdown(filename);
  console.log(documentLink);
  res.status(201).json({ documentLink });
};

module.exports = {
  createIdeaWithDocument,
  createDocumentSupportedFromEditor,
  uploadSupportDocument,
  getAllIdeas,
  getSingleIdea,
  commentToIdea,
  reactionToIdea
};
