const express = require("express");
const router = express.Router();
const AppliedJob = require("../models/AppliedJob");
const auth = require("../middleware/auth");

// GET all applied jobs (admin)
router.get("/", auth, async (req, res) => {
  try {
    const apps = await AppliedJob.find().populate("user jobId").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applied jobs", error: err.message });
  }
});

// GET applied jobs for a specific user
router.get("/my", auth, async (req, res) => {
  try {
    const myApps = await AppliedJob.find({ user: req.user._id })
      .populate("jobId")
      .sort({ createdAt: -1 });
    res.json(myApps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your applied jobs", error: err.message });
  }
});

// POST apply to a job
router.post("/", auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "Job ID required" });

    // prevent duplicate applications
    const exists = await AppliedJob.findOne({ user: req.user._id, jobId });
    if (exists) return res.status(400).json({ message: "Already applied to this job" });

    const newApp = await AppliedJob.create({ user: req.user._id, jobId });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: "Error applying job", error: err.message });
  }
});

module.exports = router;
