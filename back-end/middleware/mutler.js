const multer = require("multer");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const ExcelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./statics/excels");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const documentFilter = (req, file, cb) => {
    if (
      file.mimetype.includes("docx") ||
      file.mimetype.includes("doc") || file.mimetype.includes('pdf')
    ) {
      cb(null, true);
    } else {
      cb("Only accept docx, doc and pdf.", false);
    }
}

const DocumentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(nul, './statics/documents');
    },
    filename: (req, file, cb) => {
         const fileName = file.originalname.toLowerCase().split(" ").join("-");
         cb(null, fileName);
    }
})

const uploadExcel = multer({
  storage: ExcelStorage,
  fileFilter: excelFilter,
});



const uploadDocument = multer({
    storage: DocumentStorage,
    fileFilter: documentFilter,
})

module.exports = {uploadExcel, uploadDocument};
