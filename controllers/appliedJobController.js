const AppliedJob = require("../models/AppliedJob");

// Fetch all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await AppliedJob.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Create a new application (when user applies)
exports.createApplication = async (req, res) => {
  try {
    const { name, email, resumeUrl, jobId, jobTitle } = req.body;
    const app = await AppliedJob.create({
      name,
      email,
      resumeUrl,
      jobId,
      jobTitle,
    });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: "Failed to apply" });
  }
};
