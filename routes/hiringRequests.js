// routes/hiringRequests.js
const express = require('express');
const router = express.Router();
const HiringRequest = require('../models/HiringRequest');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/auth'); // same as jobs

// Create (public form submission)
router.post('/', async (req, res) => {
  try {
    const { companyName, name, mobile, designation, email } = req.body;

    // Save form data to MongoDB
    const newReq = new HiringRequest({ companyName, name, mobile, designation, email });
    await newReq.save();

    // Create email transporter
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.SMTP_USER,   
    //     pass: process.env.SMTP_PASS, 
    //   },
    // });
    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
      rejectUnauthorized: false // DANGER: USE FOR DEBUGGING ONLY!
  },
  socketTimeout: 60000, // 5 minutes (300,000 ms). Default is usually 1 minute (60000 ms).
  connectionTimeout: 60000 // Also set connection timeout
});

    // Styled email content
    const mailOptions = {
      from: process.env.SMTP_USER,                        // shows user's email as sender
      replyTo: email,                     // admin can reply directly to user
      to: process.env.RECEIVER_EMAIL,     // admin’s inbox
      subject: `New Hiring Request from ${companyName}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #0078D7; color: white; padding: 20px 30px; text-align: center;">
              <h2 style="margin: 0;">New Hiring Request</h2>
            </div>

            <!-- Body -->
            <div style="padding: 25px 30px; color: #333;">
              <p style="font-size: 16px;">Hello Admin,</p>
              <p style="font-size: 15px;">A new hiring request has been submitted with the following details:</p>

              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; width: 160px; font-weight: bold;">Company Name:</td>
                  <td style="padding: 8px 0;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Mobile:</td>
                  <td style="padding: 8px 0;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Designation:</td>
                  <td style="padding: 8px 0;">${designation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
              </table>

              <p style="margin-top: 30px; font-size: 14px; color: #555;">
                Best regards,<br>
                <strong>Your Website Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f0f0f0; padding: 15px 30px; text-align: center; font-size: 13px; color: #777;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    // Attempt to send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status_code: 200,
      message: "Request saved and email processed successfully",
      data: newReq,
    });

  } catch (err) {
  console.error("Error in /api/hiringRequests:", err);
  console.error("Nodemailer error message:", err.message);
  console.error("Nodemailer error code:", err.code);
  console.error("Nodemailer error command:", err.command);
  console.error("Nodemailer error response:", err.response);

  if (err.responseCode) {
    console.error("Nodemailer response code:", err.responseCode);
  }

  res.status(500).json({
    status_code: 500,
    message: "Server error during sending mail",
    error: err.message,
    detailedError: { // For debugging: REMOVE IN PRODUCTION
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode
    }
  });
}
});


// Get all (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const list = await HiringRequest.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
