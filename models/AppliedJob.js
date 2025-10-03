const mongoose = require("mongoose");

const appliedJobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // Applicant name
    email: { type: String, required: true },        // Applicant email
    // resumeUrl: { type: String },                    // Resume link
    // jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Link to Job
    jobTitle: { type: String },                     // Store job title for quick view
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppliedJob", appliedJobSchema);
