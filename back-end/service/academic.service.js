const AcademicYear = require("../model/academicYear");

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

module.exports = {
  createAcademicYear,
  getAcademicYear,
};
