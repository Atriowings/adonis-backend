const express = require("express");
const router = express.Router();
const AppliedJob = require("../models/AppliedJob");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');

// Create (public form submission)
router.post('/', async (req, res) => {
  // try {
  //   const { name, email, mobile, message } = req.body;
  //   const newReq = new AppliedJob({ name, email, mobile, message });
  //   await newReq.save();
  //   res.json(newReq);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
  try {
    const { name, email, mobile, message } = req.body;

    // Save to MongoDB
    const newReq = new AppliedJob({ name, email, mobile, message });
    await newReq.save();

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.SMTP_USER,          // admin email
        pass: process.env.SMTP_PASS, // app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,                     // allows admin to reply directly
      to: process.env.RECEIVER_EMAIL,            // admin’s email
      subject: `New Job Application from ${name}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

   try {
     await transporter.sendMail(mailOptions);
     console.log("Email sent successfully to", email);
    } catch (emailErr) {
    console.error("Email sending failed:", emailErr.message);
    }

    res.status(200).json({
      status_code: 200,
      message: "Sent mail successfully",
      data:newReq,
    });
     }
     catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      status_code: 500,
      message: "Server error during sending mail",
      error: err.message
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
