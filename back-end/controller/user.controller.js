const {
  getAllUser,
  getUserByUsername,
  getUserById,
  excelDataExtractor,
  createUserByExcel,
  deleteExcel,
  getUserByDepartment,
  assignStaff,
  findStaffWithoutDepartment,
  assignStaffToManager,
  updateUser,
  deleteUser,
  reactiveUser,
} = require("../service/user.service.js");

const userController = {
  getAllUser: async (req, res) => {
    const { username, department } = req.query;
    if(username && department) {
      const result = await getUserByDepartment(department, username);
      res.status(200).json(result);
      return;
    }
    if (username) {
      const result = await getUserByUsername(username);
      res.status(200).json(result);
      return;
    } else if (department) {
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
  assignStaffToManager: async (req, res) => {
    const { role, department } = req.body;
    const { id } = req.params;
    try {
      await assignStaffToManager(role, department, id);
      res
        .status(200)
        .json({ message: "Assign Staff Account To QA Manager Successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message, status: 400 });
    }
  },
  getUserWithoutDepartment: async (req, res) => {
    try {
      const result = await findStaffWithoutDepartment();
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },
  createUserExcel: async (req, res) => {
    try {
      const { filename } = req.params;
      await createUserByExcel(filename.toLowerCase().split(" ").join("-"));
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  uploadExcel: async (req, res) => {
    try {
      const filename = req.file.filename;
      const jsonData = await excelDataExtractor(filename.toLowerCase().split(" ").join("-"));
      res.status(200).json({ status: 200, data: jsonData, filename: filename });
    } catch (err) {
      console.log(err);
    }
  },
  cancelCreateUserByExcel: async (req, res) => {
    try {
      const { filename } = req.params;
      await deleteExcel(filename.toLowerCase().split(" ").join("-"));
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      await updateUser(id, req.body);
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await deleteUser(id);
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  reactive: async (req, res) => {
    try {
      const { id } = req.params;
      await reactiveUser(id);
      res.status(200).json({ message: "Account actived" });
    } catch (error) {
      res.status(400).json({ message: error.message });

    }
  }
};

module.exports = userController;
