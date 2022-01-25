const {sendNewEmail} = require('../queue/email.queue')

const emailController = {
    sendMail: async (req, res) => {
        const {message, ...rest} = req.body;
        const response = await sendNewEmail({
          ...rest,
          html: `<b>${message}</b>`,
        });
        res.status(200).json({message: "mail sended"})
    }
}

module.exports = emailController