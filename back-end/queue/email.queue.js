const Bull = require('bull');
const emailProcess = require('../processes/email.process');

const emailQueue = new Bull("email", {
  redis: {port: process.env.REDIS_PORT, host: process.env.REDIS_HOST},
});

emailQueue.process(emailProcess);

const sendNewEmail = (data) => {
  emailQueue.add(data, {
    attempts: 5,
  });
};

module.exports = { sendNewEmail };
