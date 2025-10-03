// models/HiringRequest.js
const mongoose = require('mongoose');

const hiringRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('HiringRequest', hiringRequestSchema);
