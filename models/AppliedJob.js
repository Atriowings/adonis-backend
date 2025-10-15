const mongoose = require("mongoose");

// const appliedJobSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },         // Applicant name
//     email: { type: String, required: true },        // Applicant email
//     resumeUrl: { type: String },                    // Resume link
//     jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Link to Job
//     jobTitle: { type: String },                     // Store job title for quick view
//   },
//   { timestamps: true }
// );
const appliedJobSchema = new mongoose.Schema( {
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String, required: true },
},
{ timestamps: true } );
module.exports = mongoose.model("AppliedJob", appliedJobSchema);
