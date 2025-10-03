const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth'); // create dummy if not exist

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
  const key = req.params.key;
  const s = await Setting.findOne({ key });
  res.json(s ? s.value : null);
});

// POST /api/settings/:key (protected)
router.post('/:key', auth, async (req, res) => {
  const key = req.params.key;
  const { value } = req.body;
  try {
    const s = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(s);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
