const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const privateInfo = require('../util/private-info')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: privateInfo.sendGridApiKey
    }
}))

exports.sendEmail = (toEmail, token) => {
    let text = `<p>Reset your password <a href="${token}"><b>Here</b></a>.`;
    if(transporter != null){
        transporter.sendMail({
            to: toEmail,
            from: 'resetPassword@bagheriali.dev',
            subject: 'Reset Password',
            html: text
        });
    }
    else
        return false;
}