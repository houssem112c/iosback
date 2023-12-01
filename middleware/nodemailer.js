// Import nodemailer
const nodemailer = require('nodemailer');

// Create a transporter with your email service provider's SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fakerealemail0@gmail.com',
    pass: 'Ss02082001'
  }
});

module.exports = transporter;
