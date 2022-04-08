const {
  getFileUrl,
  createIdea,
  createDocumentFromMarkdown,
  getAllIdeaWithFilter,
  countAllIdeas,
  getIdeaById,
  commentToAnIdea,
  reactionToAnIdea,
  increaseView,
  countIdeaInDepartment,
  countIdeaInOneDepartment,
  findPostIdea,
  findUserIdInDerpartment,
  findStaffPostOfDepatment
} = require("../service/idea.service");
const {noticeQAForNewDocUpload} = require('../service/email.service')

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
  const { userId, content, isAnonymous } = req.body;
  const { id } = req.params;

  await commentToAnIdea(id, content, userId, isAnonymous);
  res.status(201).json({ message: "comment success" });
};
const reactionToIdea = async (req, res) => {
  const { userId, reactionType } = req.body;
  const { id } = req.params;

  await reactionToAnIdea(id, reactionType, userId);
  res.status(201).json({ message: "react success" });
};

const createIdeaWithDocument = async (req, res) => {
  const { title, description, documentLink, category, isAnonymous } = req.body;
  const userId = req?.user?._id || null;
  const createdIdea = await createIdea(
    title,
    description,
    documentLink,
    category,
    userId,
    isAnonymous
  );
  res.status(201).json({ message: "Idea Created", data: createdIdea });
};

const uploadSupportDocument = async (req, res) => {
  const filename = req.file.filename;
  console.log(filename);
  const documentLink = await getFileUrl(filename);
  await noticeQAForNewDocUpload(documentLink, req.user.id);

  res.status(201).json({ documentLink });
};

const createDocumentSupportedFromEditor = async (req, res) => {
  const filename = req.file.filename;  
  const user = req.user;
  const documentLink = await createDocumentFromMarkdown(filename, user.fullname, user.id);
  await noticeQAForNewDocUpload(documentLink, req.user.id);

  res.status(201).json({ documentLink });
};

const inscreaseViewOfIdea = async (req, res) => {
  await increaseView(req.params.id)
  res.sendStatus(200);
}

const countIdea = async (req, res) =>{
  const result = await countIdeaInDepartment();
  res.status(200).json(result);
  console.log(result);
}

const findPost = async (req, res) =>{
  const nameDepartment = await findPostIdea();
  const result = await findUserIdInDerpartment(nameDepartment);
  res.status(200).send(result); 
}

const countIdeaOfDepartment = async (req, res) =>{
  const result = await countIdeaInOneDepartment(req.user.department);
  res.status(200).json(result);
}

const findPostOfDepartment = async (req, res) =>{
  console.log(req.user.department);
  const result = await findStaffPostOfDepatment(req.user.department);
  res.status(200).json(result);
}

module.exports = {
  createIdeaWithDocument,
  createDocumentSupportedFromEditor,
  uploadSupportDocument,
  getAllIdeas,
  getSingleIdea,
  commentToIdea,
  reactionToIdea,
  inscreaseViewOfIdea,
  countIdea,
  findPost,
  countIdeaOfDepartment,
  findPostOfDepartment
};
