const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
   const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atriowingstesting@gmail.com',
    pass:'nnri awox ckkf imuy'
  },
});


    await transporter.sendMail({
      from: email,
      to: 'atriowingstesting@gmail.com',
      subject: 'Hiring Request',
      text: `From: ${name} (${email})\n\n${message}`
    });

    res.json({ message: 'Mail sent successfully' });
  }catch (err) {
  console.error("Mail sending error:", err);
  res.status(500).json({ message: 'Mail failed', error: err.message });
}

});

module.exports = router;
