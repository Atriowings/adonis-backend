const express = require("express");
const router = express.Router();
const AppliedJob = require("../models/AppliedJob");
const auth = require("../middleware/auth");

// Create (public form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    const newReq = new AppliedJob({ name, email, mobile, message });
    await newReq.save();
    res.json(newReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const list = await AppliedJob.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
