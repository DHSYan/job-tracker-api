import ApplicationStatus from "../enums/applicationStatus.js";

import mongoose from "mongoose" ;

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
    required: true
  },
  notes: {
    type: Array,
    required: false
  }
});

export default mongoose.model("Job", JobApplicationSchema);
