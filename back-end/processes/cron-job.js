const cron = require('node-schedule');
const AcademicYear = require('../model/academicYear')

const cronJobProcess = async (jobRunner) => {
    const getListAcadYear = await AcademicYear.find().sort({createdAt: 1});
    const lastestYear = getListAcadYear[getListAcadYear.length - 1];
    cron.scheduleJob(lastestYear.endDate, () => {
        jobRunner();
        console.log('Job running')
    })
}


module.exports = cronJobProcess;