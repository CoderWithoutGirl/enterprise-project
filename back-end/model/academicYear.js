const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxlength: 50,
  },
  startDate: {
    type: Date,
    require: true,
  },
  closureDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
});

const AcademicYearModel = mongoose.model("AcademicYear", academicYearSchema);

module.exports = AcademicYearModel;
