// routes/hiringRequests.js
const express = require('express');
const router = express.Router();
const HiringRequest = require('../models/HiringRequest');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/auth'); // same as jobs

// Create (public form submission)
router.post('/', async (req, res) => {
//   try {
//     const { companyName, name, mobile, designation, email } = req.body;
//     const newReq = new HiringRequest({ companyName, name, mobile, designation, email });
//     await newReq.save();
//     res.json(newReq);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
  try {
    const { companyName, name, mobile, designation, email } = req.body;

    // Save form data to MongoDB
    const newReq = new HiringRequest({ companyName, name, mobile, designation, email });
    await newReq.save();

    // Create a transporter (your admin account will actually send the mail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,          // admin Gmail address
        pass: process.env.SMTP_PASS, // app-specific password
      },
    });

    // Mail details
    const mailOptions = {
      from:process.env.SMTP_USER,
      // from: email,                             // shows user's email as sender
      // replyTo: email,                          // admin can reply directly to user
      to: process.env.RECEIVER_EMAIL,             // admin's inbox
      subject: `New Hiring Request from ${companyName}`,
      html: `
        <h2>New Hiring Request</h2>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Designation:</strong> ${designation}</p>
        <p><strong>Email:</strong> ${email}</p>
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
      data: { newReq },
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
// Send email
  //   await transporter.sendMail(mailOptions);

  //   res.json({
  //     message: 'Hiring request submitted successfully and email sent to admin',
  //     data: newReq,
  //   });catch (err) {
  //   console.error('Error:', err);
  //   res.status(500).json({ message: err.message });
  // }



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
