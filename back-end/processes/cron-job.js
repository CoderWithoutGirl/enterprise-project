const cron = require('node-schedule');
const AcademicYear = require('../model/academicYear')

const cronJobProcess = async (jobRunner) => {
    const getListAcadYear = await AcademicYear.find().sort({createdAt: 1});
    const lastestYear = getListAcadYear[getListAcadYear.length - 1];
    const finalClosureDate = lastestYear?.endDate;
    if(finalClosureDate) {
        console.log(new Date(finalClosureDate));
        cron.scheduleJob(new Date(finalClosureDate), () => {
          jobRunner();
          console.log("Job running");
        });
    }
}


module.exports = cronJobProcess;