const Job = require('../models/Job');

// Get all jobs with optional search
exports.getJobs = async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  try {
    const jobs = await Job.find({
      $or: [
        { title: regex },
        { company: regex },
        { location: regex },
        { description: regex }
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
    const job = await Job.findById(req.params.id);
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
    const { title, applyLink } = req.body;

    // Backend validation
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    // if (!company || !company.trim()) return res.status(400).json({ message: 'Company is required' });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token or user not found' });
    }

    const job = new Job({
      title: title.trim(),
      // company: company.trim(),
      // location: location?.trim() || '',
      // experience: experience?.trim() || '',
      // vacancies: Number(vacancies) || 1,
      // description: description?.trim() || '',
      applyLink: applyLink?.trim() || '',
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
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
