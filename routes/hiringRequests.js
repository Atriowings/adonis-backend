// routes/hiringRequests.js
const express = require('express');
const router = express.Router();
const HiringRequest = require('../models/HiringRequest');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/auth'); // same as jobs
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY); // set this in Railway variables

// Create (public form submission)
// router.post('/', async (req, res) => {
//   try {
//     const { companyName, name, mobile, designation, email } = req.body;

//     const newReq = new HiringRequest({ companyName, name, mobile, designation, email });
//     await newReq.save();

//     const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: process.env.SMTP_SECURE,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
//     socketTimeout: 60000, 
//   connectionTimeout: 60000 
// });
    
//     const mailOptions = {
//       from: process.env.SMTP_USER,                    
//       replyTo: email,                    
//       to: process.env.RECEIVER_EMAIL,  
//       subject: `New Hiring Request from ${companyName}`,
//       html: `
//         <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
//           <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
            
//             <!-- Header -->
//             <div style="background-color: #0078D7; color: white; padding: 20px 30px; text-align: center;">
//               <h2 style="margin: 0;">New Hiring Request</h2>
//             </div>

//             <!-- Body -->
//             <div style="padding: 25px 30px; color: #333;">
//               <p style="font-size: 16px;">Hello Admin,</p>
//               <p style="font-size: 15px;">A new hiring request has been submitted with the following details:</p>

//               <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//                 <tr>
//                   <td style="padding: 8px 0; width: 160px; font-weight: bold;">Company Name:</td>
//                   <td style="padding: 8px 0;">${companyName}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; font-weight: bold;">Name:</td>
//                   <td style="padding: 8px 0;">${name}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; font-weight: bold;">Mobile:</td>
//                   <td style="padding: 8px 0;">${mobile}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; font-weight: bold;">Designation:</td>
//                   <td style="padding: 8px 0;">${designation}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; font-weight: bold;">Email:</td>
//                   <td style="padding: 8px 0;">${email}</td>
//                 </tr>
//               </table>

//               <p style="margin-top: 30px; font-size: 14px; color: #555;">
//                 Best regards,<br>
//                 <strong>Your Website Team</strong>
//               </p>
//             </div>

//             <!-- Footer -->
//             <div style="background-color: #f0f0f0; padding: 15px 30px; text-align: center; font-size: 13px; color: #777;">
//               © ${new Date().getFullYear()} Your Company. All rights reserved.
//             </div>
//           </div>
//         </div>
//       `,
//     };

   
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({
//       status_code: 200,
//       message: "Request saved and email processed successfully",
//       data: newReq,
//     });

//   } catch (err) {
//   console.error("Error in /api/hiringRequests:", err);
//   console.error("Nodemailer error message:", err.message);
//   console.error("Nodemailer error code:", err.code);
//   console.error("Nodemailer error command:", err.command);
//   console.error("Nodemailer error response:", err.response);

//   if (err.responseCode) {
//     console.error("Nodemailer response code:", err.responseCode);
//   }

//   res.status(500).json({
//     status_code: 500,
//     message: "Server error during sending mail",
//     error: err.message,
//     detailedError: { 
//         code: err.code,
//         command: err.command,
//         response: err.response,
//         responseCode: err.responseCode
//     }
//   });
// }
// });
router.post("/", async (req, res) => {
  try {
    const { companyName, name, mobile, designation, email } = req.body;

    // Save to MongoDB
    const newReq = new HiringRequest({ companyName, name, mobile, designation, email });
    await newReq.save();

    // Styled HTML email
    const htmlContent = `
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
    `;

    // Send email via Resend API
    const result = await resend.emails.send({
      from: `Your Website <${process.env.RESEND_SENDER}>`, // e.g. "no-reply@yourdomain.com"
      to: process.env.RECEIVER_EMAIL, // admin’s email
      reply_to: email, // allows direct reply
      subject: `New Hiring Request from ${companyName}`,
      html: htmlContent,
    });

    console.log("Resend API Response:", result);

    res.status(200).json({
      status_code: 200,
      message: "Request saved and email sent successfully",
      data: newReq,
    });
  } catch (err) {
    console.error("Error in /api/hiringRequests:", err);

    res.status(500).json({
      status_code: 500,
      message: "Server error during sending mail",
      error: err.message,
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
