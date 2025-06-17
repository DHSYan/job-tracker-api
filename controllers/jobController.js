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
  let result;

  if (status === "N/A") {
    await JobApplication.find({
      company: company,
      title: title,
    }).then(jobs => {
      console.log(jobs);
      result = jobs;
    })
    return result;
  } else {
    await JobApplication.find({
      company: company,
      title: title,
      status: status
    }).then(jobs => {
      console.log(jobs);
      result = jobs;
    })
    return result;
  }
}


module.exports = {
  createApplication,
  getApplication
}

