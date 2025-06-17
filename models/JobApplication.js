const ApplicationStatus = require("../enums/applicationStatus");

const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.SAVED
  },
  appliedDate: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model("Job", JobApplicationSchema);
