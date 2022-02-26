const {
  getAllUser,
  getUserByUsername,
  getUserById,
  excelDataExtractor,
  createUserByExcel,
  deleteExcel,
  getUserByDepartment,
  assignStaff,
} = require("../service/user.service.js");

const userController = {
  getAllUser: async (req, res) => {
    const {username, department} = req.query;
    if (username) {
      const result = await getUserByUsername(username);
      res.status(200).json(result);
      return;
    }
    else if(department) {
      console.log(department);
      const result = await getUserByDepartment(department);
      res.status(200).json(result);
      return;
    } else {
      const user = await getAllUser();
      res.status(200).json(user);
    }
  },
  getUserById: async (req, res) => {
    const id = req.params.id;
    const result = await getUserById(id);
    res.status(200).json(result);
  },
  assignStaff: async (req, res) => {
    const { role, department } = req.body;
    const { id } = req.params;
    try {
      await assignStaff(role, department, id);
      res.status(200).json({ message: "Assign Staff Account Successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message, status: 400 });
    }
  },
  createUserExcel: async (req, res) => {
    try {
      const { filename } = req.params;
      await createUserByExcel(filename);
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  uploadExcel: async (req, res) => {
    try {
      const filename = req.file.filename;
      const jsonData = await excelDataExtractor(filename);
      res.status(200).json({ status: 200, data: jsonData, filename: filename });
    } catch (err) {
      console.log(err);
    }
  },
  cancelCreateUserByExcel: async (req, res) => {
    try {
      const { filename } = req.params;
      await deleteExcel(filename);
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = userController;
