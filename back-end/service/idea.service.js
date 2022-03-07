const IdeaModel = require('../model/idea');
const CategoryModel = require('../model/category');
const mdpdf = require('mdpdf');
const fs = require('fs');
const createIdea = async (title, description, documentLink = "", category, userId) => {
    const categoryInDB = await CategoryModel.findOne({name: category});
    const newIdea = new IdeaModel({
      title,
      description,
      documentLink,
      category: categoryInDB._id,
      userId
    });
    await newIdea.save();
    return newIdea;
}

const getFileUrl = (filename) => {
    const documentLink = `/statics/documents/${filename}`;
    return documentLink;
}

const createDocumentFromMarkdown = async (mdfile) => {
  try {
        const options = {
          source: __basedir + `/statics/documents/${mdfile}`,
          destination:
            __basedir +
            `/statics/documents/document-auto-created-${Date.now()}.pdf`,
          pdf: {
            format: "A4",
            orientation: "portrait",
          },
        };
        const filePath = await mdpdf.convert(options);
        fs.unlinkSync(__basedir + `/statics/documents/${mdfile}`);
        return filePath;
      }
  catch(error) {
    console.log(error)
  }
}


module.exports = { getFileUrl, createIdea, createDocumentFromMarkdown };