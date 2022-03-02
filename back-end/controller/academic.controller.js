const {
  createAcademicYear,
  getAcademicYear,
} = require("../service/academic.service");

const academicControler = {
  create: async (req, res) => {
    try {
      console.log(req.body);
      await createAcademicYear(req.body);
      res.status(200).json({ status: 200 });
    } catch (err) {
      console.log(err);
    }
  },
  getAll: async (req, res) => {
    try {
      var values = await getAcademicYear();
      res.status(200).json(values);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = academicControler;
