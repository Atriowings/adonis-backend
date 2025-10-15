const AppliedJob = require("../models/AppliedJob");

// Get all jobs with optional search
exports.getJobs = async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  try {
    const jobs = await AppliedJob.find({
      $or: [
        { name: regex },
        { email: regex },
        { mobile: regex },
        { message: regex }
      ]
    }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await AppliedJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create new job with validation
exports.createJob = async (req, res) => {
  try {
    // const { title, applyLink } = req.body;

    // Backend validation
    // if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    // if (!company || !company.trim()) return res.status(400).json({ message: 'Company is required' });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token or user not found' });
    }

    const job = new AppliedJob({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile?.trim() || '',
      message: message?.trim() || '',
      createdBy: req.user._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await AppliedJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await AppliedJob.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

