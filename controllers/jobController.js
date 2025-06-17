const JobApplication = require("../models/JobApplication.js");

async function createApplication(company, title, status = "applied") {
  await JobApplication.create({
    company: company,
    title: title,
    status: status,
    date: Date.now(),
  })
}

// Returns all the jobs that matches the parameter description
async function getApplication(company = "N/A", title = "N/A" , status = "N/A") {
  const result = await JobApplication.find({
    company: company,
    title: title,
    status: status
  })
}


module.exports = {
  createApplication,
  getApplication
}

