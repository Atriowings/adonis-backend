// const express = require('express');
// const router = express.Router();
// const Job = require('../models/Job');
// const auth = require('../middleware/auth');

// // GET /api/jobs?q=search
// router.get('/', async (req, res) => {
//   const q = req.query.q || '';
//   const regex = new RegExp(q, 'i');
//   try {
//     const jobs = await Job.find({
//       $or: [
//         { title: regex },
//         { company: regex },
//         { location: regex },
//         { description: regex }
//       ]
//     }).sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// // GET /api/jobs/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Not found' });
//     res.json(job);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// // Protected routes: create/update/delete
// router.post('/', auth, async (req, res) => {
//   try {
//     const job = new Job({ ...req.body, createdBy: req.user._id });
//     await job.save();
//     res.json(job);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// router.put('/:id', auth, async (req, res) => {
//   try {
//     const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(job);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// router.delete('/:id', auth, async (req, res) => {
//   try {
//     await Job.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const AppliedJob = require('../models/AppliedJob'); // ✅ import AppliedJob model
const auth = require('../middleware/auth'); // ✅ this is your JWT middleware

// ------------------ GET ALL JOBS ------------------
router.get('/', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------ GET ONE JOB ------------------
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------ CREATE JOB (Protected) ------------------
router.post('/', auth, async (req, res) => {
  try {
    const { title, applyLink } = req.body;

    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
    // if (!company?.trim()) return res.status(400).json({ message: 'Company is required' });
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

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
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------ UPDATE JOB (Protected) ------------------
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------ DELETE JOB (Protected) ------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------ GET ALL APPLIED JOBS (Protected) ------------------
router.get('/appliedJobs', auth, async (req, res) => {
  try {
    const apps = await AppliedJob.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
