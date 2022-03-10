const nodemailer = require("nodemailer");

const emailProcess = async (job) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, //  username
      pass: process.env.SMTP_PASS, // password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log(process.env.SMTP_USER)

  let info = await transporter.sendMail({
    from: "CoderWithOurGirl",
    ...job,
  });

  console.log("Message sent: %s", info.messageId);

  return nodemailer.getTestMessageUrl(info);
};

module.exports = emailProcess;
