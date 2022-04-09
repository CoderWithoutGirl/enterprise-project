const IdeaModel = require("../model/idea");
const UserModel = require("../model/user");
const CategoryModel = require("../model/category");
const DepartmentModel = require("../model/department");
const mdpdf = require("mdpdf");
const fs = require('fs')
const { notificationUser } = require('../documents/index');
const { uploadDocument } = require("../processes/cloudinary");
const { sendNewEmail } = require('../queue/email.queue')
const puppeteer = require('puppeteer');

const filterEnum = {
  VIEW: 'VIEW',
  ALPHABET: "ALPHABET",
  LIKE: "LIKE",
  DISLIKE: "DISLIKE",
  POPULAR: "POPULAR",
  DATE_ASC: "DATE_ASC",
  DATE_DESC: "DATE_DESC",
  MY_IDEA: "MY_IDEA",
};


const getAllIdeaWithFilter = async (id, filter = filterEnum.ALPHABET, page = 1, limit = 5) => {
  switch (filter) {
    case filterEnum.VIEW:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ viewCount: -1 })
        .skip((page - 1) * limit)
        .limit(limit));
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
    case filterEnum.POPULAR:
      const allPostWithBoth = await IdeaModel.find({})
        .populate("category", "name")
      return (allIdeaInDB = allPostWithBoth
        .sort(
          (prevIdea, nextIdea) =>
            nextIdea.reactions.filter((item) => item.reactionType === "Like")
              .length -
            nextIdea.reactions.filter((item) => item.reactionType === "Dislike")
              .length -
            prevIdea.reactions.filter((item) => item.reactionType === "Like")
              .length +
            prevIdea.reactions.filter((item) => item.reactionType === "Dislike")
              .length

        )
        .slice(
          (page - 1) * limit, page * limit));
    case filterEnum.DATE_ASC:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.DATE_DESC:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({
          createdAt: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.MY_IDEA:
      return (allIdeaInDB = await IdeaModel.find({user:id})
        .populate("category", "name")
        .sort({
          createdAt: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    default:
      return (allIdeaInDB = await IdeaModel.find({})
        .populate("category", "name")
        .sort({ viewCount: -1 })
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

const increaseView = async (id) => {
  const increaseViewCount = await IdeaModel.findById(id);
  increaseViewCount.viewCount = increaseViewCount.viewCount + 1;
  await increaseViewCount.save();
}

const createIdea = async (
  title,
  description,
  documentLink = "",
  category,
  userId,
  isAnonymous
) => {
  const categoryInDB = await CategoryModel.findOne({ name: category });

  const findUserIndDeaprtment = await UserModel.findById(userId.toString());

  const newIdea = new IdeaModel({
    title,
    description,
    documentLink,
    category: categoryInDB._id,
    user: userId,
    department: findUserIndDeaprtment.department,
    isAnonymous,
  });
  await newIdea.save();
  categoryInDB.ideas.push(newIdea._id);
  await categoryInDB.save();
  return newIdea;
};

const getFileUrl = async (filename) => {
  try {
    const documentLink = `/statics/documents/${filename}`;
    const result = await uploadDocument(__basedir + documentLink, filename);
    fs.unlinkSync(__basedir + documentLink);
    return result.url;
  } catch (error) {
    console.log(error);
  }
};

const createDocumentFromMarkdown = async (mdfile, fullname, id) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
      ],
    });
    const destination = `/statics/documents/${fullname.split(' ').join("-")}-${id}-${Date.now()}-support-document.pdf`
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
    fs.unlinkSync(__basedir + `/statics/documents/${mdfile}`);
    await browser.close();
    return process.env.BASE_DOWNLOAD_FILE + destination;
  } catch (error) {
    console.log(error);
  }
};

const countAllIdeas = async (limit = 5) => {
  return Math.ceil(await IdeaModel.estimatedDocumentCount() / limit);
}


const commentToAnIdea = async (postId, content, userId, isAnonymous) => {
  const ideaInDb = await IdeaModel.findById(postId);
  const author = await UserModel.findById(ideaInDb.user);
  ideaInDb.comments.push({ content, user: userId , isAnonymous});
  await ideaInDb.save();
  sendNewEmail({
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
  if (indexFound >= 0) {
    ideaInDb.reactions.splice(indexFound, 1, newReaction);
  }
  else {
    ideaInDb.reactions.push(newReaction);
  }
  await ideaInDb.save();
  sendNewEmail({
    to: author.email,
    subject: "New Reaction In Your Post",
    html: notificationUser(
      "reaction",
      author.fullname,
      process.env.BASE_IDEA_URL + ideaInDb._id.toString()
    ),
  });
}

const countIdeaInDepartment = async () => {

  const result = await IdeaModel.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } }
  ]);
  return result;
}

const findPostIdea = async () => {
  let nameDepartments = []
  const listAllUserInDepartment = await DepartmentModel.find({deleted: false}).select({ "name": 1, "_id": 0 })
  let convert = JSON.stringify(listAllUserInDepartment)
  convert = JSON.parse(convert)

  convert.map(item => {
    nameDepartments.push(Object.values(item)[0])
  })
  return nameDepartments;
}

const findUserIdInDerpartment = async (nameDepartments) => {
  const number = nameDepartments.map(async item => {

    const finduserInDepartment = await UserModel.find({ "department": item }).select({ "_id": 1 })
    let users = JSON.stringify(finduserInDepartment)
    users = JSON.parse(users)
    const findIdeaPosted = await IdeaModel.find({ "department": item }).select({ "user": 1, "_id": 0 }).distinct('user')
    let userPosted = JSON.stringify(findIdeaPosted)
    userPosted = JSON.parse(userPosted)
    console.log(userPosted);

    let result = {
      label: item,
      posted: userPosted.length,
      noPosted: users.length - userPosted.length
    }
    return result
  })

  return Promise.all(number);

}

const countIdeaInOneDepartment = async (department) => {

  const result = await IdeaModel.aggregate([
    { $match: { department: department, deleted: false } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },

  ]);
  return result;
}

const findStaffPostOfDepatment = async (department) => {

  const finduserInDepartment = await UserModel.find({ department: department, role: 'Staff' }).select({ "_id": 1 })
  let users = JSON.stringify(finduserInDepartment)
  users = JSON.parse(users)

  const findIdeaPosted = await IdeaModel.find({ department: department }).select({ "user": 1, "_id": 0 }).distinct('user')
  let userPosted = JSON.stringify(findIdeaPosted)
  userPosted = JSON.parse(userPosted)

  let result = [
    {
      StaffPosted: userPosted.length,
      StaffnoPosted: users.length - userPosted.length
    }
  ]

  return result
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
  increaseView,
  countIdeaInDepartment,
  findPostIdea,
  findUserIdInDerpartment,
  countIdeaInOneDepartment,
  findStaffPostOfDepatment
};
