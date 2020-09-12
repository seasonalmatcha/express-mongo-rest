const nodemailer = require('nodemailer');

const config = require('../config');

const mailOptions = {
  auth: {
    user: config.TRANSPORTER.EMAIL,
    pass: config.TRANSPORTER.PASSWORD,
  },
};

if (config.TRANSPORTER.SERVICE) {
  mailOptions.service = config.TRANSPORTER.SERVICE;
} else {
  mailOptions.host = config.TRANSPORTER.HOST;
  mailOptions.port = Number(config.TRANSPORTER.PORT);
}

const transporter = nodemailer.createTransport(mailOptions);

module.exports = transporter;
