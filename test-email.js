require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTest() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "Test Email",
      text: "Hello, this is a test email from my Node.js app."
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error:", err);
  }
}

sendTest();
