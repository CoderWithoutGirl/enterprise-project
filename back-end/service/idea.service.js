const IdeaModel = require("../model/idea");
const UserModel = require("../model/user");
const CategoryModel = require("../model/category");
const mdpdf = require("mdpdf");
const emailProcess = require("../processes/email.process");
const {notificationUser, notificationQA}= require('../documents/index')

const filterEnum = {
  ALPHABET: "ALPHABET",
  LIKE: "LIKE",
  DISLIKE: "DISLIKE",
  DATE_ASC: "DATE_ASC",
  DATE_DESC: "DATE_DESC",
};

const getAllIdeaWithFilter = async (filter = filterEnum.ALPHABET, page = 1, limit = 5) => {
  switch (filter) {
    case filterEnum.ALPHABET:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ title: 1 })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.LIKE:
      const allPostWithLike = await IdeaModel.find({})
        .populate("category", "name")
      return (allIdeaInDB = allPostWithLike
        .sort(
          (prevIdea, nextIdea) =>
            nextIdea.reactions.filter((item) => item.reactionType === "Like")
              .length -
            prevIdea.reactions.filter((item) => item.reactionType === "Like")
              .length
        )
        .slice((page - 1) * limit, page * limit));
    case filterEnum.DISLIKE:
        const allPostWithDislike = await IdeaModel.find({})
          .populate("category", "name")
      return (allIdeaInDB = allPostWithDislike
        .sort(
          (prevIdea, nextIdea) =>
            nextIdea.reactions.filter((item) => item.reactionType === "Dislike")
              .length -
            prevIdea.reactions.filter((item) => item.reactionType === "Dislike")
              .length
        )
        .slice(
          (page - 1) * limit, page * limit));
    case filterEnum.DATE_ASC:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.DATE_DESC:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    default:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ title: 1 })
        .skip((page - 1) * limit)
        .limit(limit));
  }
};

const getIdeaById = async (id) => {
  return await IdeaModel.findById(id)
    .populate("category", "name")
    .populate("user", "username fullname department role avatar")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "Users",
        select: "username fullname department",
      },
    })
    .populate({
      path: "reactions",
      populate: {
        path: "user",
        model: "Users",
        select: "username fullname department",
      },
    });
}

const createIdea = async (
  title,
  description,
  documentLink = "",
  category,
  userId
) => {
  const categoryInDB = await CategoryModel.findOne({ name: category });
  const newIdea = new IdeaModel({
    title,
    description,
    documentLink,
    category: categoryInDB._id,
    user: userId,
  });
  await newIdea.save();
  return newIdea;
};

const getFileUrl = (filename) => {
  const documentLink = `/statics/documents/${filename}`;
  return documentLink;
};

const createDocumentFromMarkdown = async (mdfile) => {
  try {
    const destination = `/statics/documents/document-auto-created-${Date.now()}.pdf`
    const options = {
      source: __basedir + `/statics/documents/${mdfile}`,
      destination:
        __basedir + destination,
      pdf: {
        format: "A4",
        orientation: "portrait",
      },
    };
    await mdpdf.convert(options);
    return destination;
  } catch (error) {
    console.log(error);
  }
};

const countAllIdeas = async (limit = 5) => {
  return Math.ceil(await IdeaModel.estimatedDocumentCount() / limit);
}


const commentToAnIdea = async (postId, content, userId) => {
  const ideaInDb = await IdeaModel.findById(postId);
    const author = await UserModel.findById(ideaInDb.user);
  ideaInDb.comments.push({content, user: userId});
  emailProcess({
    to: author.email,
    subject: "New Comment In Your Post",
    html: notificationUser(
      "comment",
      author.fullname,
      process.env.BASE_IDEA_URL + ideaInDb._id.toString()
    ),
  });
}

const reactionToAnIdea = async (postId, reactionType, userId) => {
  const ideaInDb = await IdeaModel.findById(postId);
  const author = await UserModel.findById(ideaInDb.user);
  const newReaction = { reactionType, user: userId };
  const indexFound = ideaInDb.reactions.findIndex(
    (reaction) => reaction.user.toString() === userId
  );
  if(indexFound >= 0) {
    ideaInDb.reactions.splice(indexFound, 1, newReaction);
  }
  else {
    ideaInDb.reactions.push(newReaction);
  }
  await ideaInDb.save();
  emailProcess({
    to: author.email,
    subject: "New Reaction In Your Post",
    html: notificationUser(
      "reaction",
      author.fullname,
      process.env.BASE_IDEA_URL + ideaInDb._id.toString()
    ),
  });
}

module.exports = {
  getFileUrl,
  createIdea,
  createDocumentFromMarkdown,
  getAllIdeaWithFilter,
  countAllIdeas,
  getIdeaById,
  commentToAnIdea,
  reactionToAnIdea,
};
