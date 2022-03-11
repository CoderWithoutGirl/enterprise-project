const emailProcess = require("../processes/email.process");
const { notificationQA } = require("../documents/index");
const UserModel = require("../model/user");

const noticeQAForNewDocUpload = async (documentLink, userId) => {
    const ownerOfDocument = await UserModel.findById(userId);
    const QAofDepartment = await UserModel.findOne({
      role: process.env.QACOORDINATOR,
    department: ownerOfDocument.department});
  emailProcess({
    to: QAofDepartment.email,
    subject: "New Document Uploaded",
    html: notificationQA(
      QAofDepartment.fullname,
      QAofDepartment.department,
      documentLink
    ),
  });
};

module.exports = {noticeQAForNewDocUpload}
