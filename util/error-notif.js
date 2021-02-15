const axios = require('axios');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const privateInfo = require('./private-info')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: privateInfo.sendGridApiKey
    }
}))

function stringify (errors,method) {
    let text = "";
    let temp;
    let i = 1;
    const time = new Date();
    if(method="telegram"){
        while(errors.length > i-1){
            const error = errors[i-1];
            temp = `
            ${i}. <b>Status code: </b>${error.status}
                <b>Error massage: </b>${error.massage}
                <b>Error data: </b>${error.data}
                <b>Date and Time: </b>${time}`;
            text =  text + temp;
            i++;
        }
    }
    else if(method="email"){
        while(errors.length > i-1){
            const error = errors[i-1];
            temp = `
            <p>${i}. <b>Status code: </b>${error.status}</p>\n
            <p>    <b>Error massage: </b>${error.massage}</p>\n
            <p>    <b>Error data: </b>${error.data}</p>\n
            <p>    <b>Date and Time: </b>${time}</p>\n`;
            text =  text + temp;
            i++;
        }
    }
    return text;
}

exports.sendViaTelegram = (TelegramChat_id,serverName,serverIP,errors) => {
    let text = `This massage is from <b>${serverName}</b>, <a href="${serverIP}"><b>Server IP</b></a>. Error Content: `+stringify(errors,"telegram");

    const url = `https://api.telegram.org/bot${privateInfo.botToken}/sendMessage?chat_id=${TelegramChat_id}&parse_mode=HTML&text=${text}`;

    axios.post(url)
    .then(res => {
        result = true;
    })
    .catch(error => {
        console.error(error);
    })
    return result;
}

exports.sendViaEmail = (toEmail,serverName,serverIP,errors) => {
    let text = `<p>This massage is from <b>${serverName}</b>, <a href="${serverIP}"><b>Server IP</b></a>. Error Content: </p>`+stringify(errors,"email");
    if(transporter != null){
        transporter.sendMail({
            to: toEmail,
            from: 'debug@bagheriali.dev',
            subject: 'Error Notifier',
            html: text
        });
    }
    else
        return false;
}
