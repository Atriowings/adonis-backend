// routes/hiringRequests.js
const express = require('express');
const router = express.Router();
const HiringRequest = require('../models/HiringRequest');
const verifyToken = require('../middleware/auth'); // same as jobs

// Create (public form submission)
router.post('/', async (req, res) => {
  try {
    const { companyName, name, mobile, designation } = req.body;
    const newReq = new HiringRequest({ companyName, name, mobile, designation });
    await newReq.save();
    res.json(newReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
