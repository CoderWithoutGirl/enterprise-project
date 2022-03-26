const AcademicYear = require("../model/academicYear");
const Idea = require("../model/idea");
const CategoryModel = require("../model/category");
const ObjectToCsv = require('objects-to-csv');
const User = require('../model/user')
const cloudinary = require('cloudinary')
const fs = require('fs');
const https = require('https');
const archiver = require('archiver');
const emailProcess = require('../processes/email.process');

const createAcademicYear = async (academicYear) => {
  const { startDate, endDate, name, closureDate } = academicYear;

  if (startDate === "" && endDate === "" && name === "" && closureDate === "") {
    throw new Error("StartDate, EndDate, Name and ClosureDate is required");
    return;
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate need after start date");
    return;
  }

  if (
    !(
      new Date(startDate).getTime() < new Date(closureDate).getTime() &&
      new Date(closureDate).getTime() < new Date(endDate).getTime()
    )
  ) {
    throw new Error("Closure date need after start date and befor end date");
    return;
  }

  const checkAcademicYearExistedInDb = await AcademicYear.findOne({ name });
  if (checkAcademicYearExistedInDb) {
    throw new Error("AcademicYear Name already exists");
    return;
  } else {
    const createAcademic = new AcademicYear({ ...academicYear });
    await createAcademic.save();
    return createAcademic;
  }
};

const getAcademicYear = async () => {
  let result = await AcademicYear.find({});
  return result;
};

const getAcademicYearById = async (id) => {
  const result = await AcademicYear.findById(id);
  if (!result) {
    throw new Error("Academic year does not exist");
  }
  return result;
};

const updateAcademicYear = async (id, academicYear) => {
  const { startDate, endDate, name, closureDate } = academicYear;

  var academicYearDb = AcademicYear.findById(id);
  if (!academicYearDb) {
    throw new Error("Academic year does not exist");
    return;
  }

  if (startDate === "" && endDate === "" && name === "" && closureDate === "") {
    throw new Error("StartDate, EndDate, Name and ClosureDate is required");
    return;
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate need after start date");
    return;
  }

  if (
    !(
      new Date(startDate).getTime() < new Date(closureDate).getTime() &&
      new Date(closureDate).getTime() < new Date(endDate).getTime()
    )
  ) {
    throw new Error("Closure date need after start date and befor end date");
    return;
  }

  const checkAcademicYearExistedInDb = await AcademicYear.findOne({ name })
    .where("_id")
    .ne(id);
  if (checkAcademicYearExistedInDb) {
    throw new Error("AcademicYear Name already exists");
    return;
  } else {
    await AcademicYear.findByIdAndUpdate(id, {
      startDate,
      endDate,
      name,
      closureDate,
    });
  }
};

const archiveAllDocuments = async () => {
  const autoCreatedDocumentsOutput = fs.createWriteStream(
    __basedir + `/statics/archiver/auto-created-documents.zip`
  );
  const autoCreatedDocumentArchive = archiver("zip", {
    zlib: { level: 2 },
  });
  autoCreatedDocumentsOutput.on("end", function() {
    console.log("Data has been drained");
  });
  autoCreatedDocumentArchive.on("error", function(err) {
    throw err;
  });

  autoCreatedDocumentArchive.pipe(autoCreatedDocumentsOutput);

  autoCreatedDocumentArchive.directory(`${__basedir}/statics/documents`, false)
  
  await autoCreatedDocumentArchive.finalize();
}


const exportCsvFromDb = async () => {
  const allIdeaInDb = await Idea.find({}).populate('category', 'name');
  const jsonToParse = allIdeaInDb.map(idea => ({Title: idea.title, Description: idea.description, Category: idea.category.name, Comments: idea.comments.length, "Total Reactions": idea.reactions.length}))
  return jsonToParse;
}

const sendToQAManager = async () => {
  await archiveAllDocuments();
  const ideasCsv = await exportCsvFromDb();
  const csv = new ObjectToCsv(ideasCsv);
  await csv.toDisk(`${__basedir}/statics/archiver/report.csv`);
  const qaAccount = await User.findOne({role: process.env.QAMANAGER});
  const documentsUploadZipUrl = await cloudinary.v2.utils.download_folder(
    "documents",
    { target_public_id: "MyFolder" },
    (error, result) => result
  );
  const attachments = [
    {
      path: `${__basedir}/statics/archiver/auto-created-documents.zip`,
    },
    {
      path: `${__basedir}/statics/archiver/report.csv`,
    },
    {
      filename: 'uploaded-document.zip',
      path: documentsUploadZipUrl,
    },
  ];
  await emailProcess({
    to: qaAccount.email,
    subject: "All Document and Idea Reports",
    attachments: attachments,
  });
}

module.exports = {
  createAcademicYear,
  getAcademicYear,
  getAcademicYearById,
  updateAcademicYear,
  archiveAllDocuments,
  exportCsvFromDb,
  sendToQAManager,
};
