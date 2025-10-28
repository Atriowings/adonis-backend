const express = require("express");
const router = express.Router();
const AppliedJob = require("../models/AppliedJob");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');

// Create (public form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // Save to MongoDB
    const newReq = new AppliedJob({ name, email, mobile, message });
    await newReq.save();

    // Set up email transport
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail', // or your preferred service
    //   auth: {
    //     user: process.env.SMTP_USER,   // admin email
    //     pass: process.env.SMTP_PASS,   // app-specific password
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
  }
});
    

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER, // allows admin to reply directly
      replyTo: email, 
      to: process.env.RECEIVER_EMAIL, // admin’s email
      subject: `New Job Application from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background-color: #0078D7; color: white; padding: 20px 30px; text-align: center;">
              <h2 style="margin: 0;">New Job Application Received</h2>
            </div>

            <div style="padding: 25px 30px; color: #333333;">
              <p style="font-size: 16px;">Hello Admin,</p>
              <p style="font-size: 15px;">You’ve received a new job application with the following details:</p>

              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; width: 120px; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Mobile:</td>
                  <td style="padding: 8px 0;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; font-weight: bold;">Message:</td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>
              </table>

              <p style="margin-top: 30px; font-size: 14px; color: #555;">Best regards,<br>
              <strong>Your Website Team</strong></p>
            </div>

            <div style="background-color: #f0f0f0; padding: 15px 30px; text-align: center; font-size: 13px; color: #777;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    res.status(200).json({
      status_code: 200,
      message: "Mail sent successfully",
      data: newReq,
    });

  } catch (err) {
  console.error("Error in /api/appliedJobs:", err);
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
router.get('/', async (req, res) => {
  try {
    const list = await AppliedJob.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
