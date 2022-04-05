const nodemailer = require("nodemailer");

const emailProcess = async (job) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    ignoreTLS: true,
    auth: {
      user: process.env.SMTP_USER, //  username
      pass: process.env.SMTP_PASS, // password
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    debug: true,
  });

  let info = await transporter.sendMail({
    from: "CoderWithOurGirl",
    ...job.data,
  });

  console.log("Message sent: %s", info.messageId);

  return nodemailer.getTestMessageUrl(info);
};

module.exports = emailProcess;
