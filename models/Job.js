// const mongoose = require('mongoose');

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },            // Job designation/title
//   company: String,
//   location: String,
//   experience: String,
//   vacancies: { type: Number},
//   description: String,
//   applyLink: String, // clicking job opens this external link
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// module.exports = mongoose.model('Job', jobSchema);

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // company: { type: String, required: true },
  // location: String,
  // experience: String,
  // vacancies: { type: Number, default: 1 },
  // description: String,
  applyLink: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
