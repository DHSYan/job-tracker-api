import JobApplication from "../models/JobApplication.js";

export async function createApplication(company, title, status = "applied") {
  await JobApplication.create({
    company: company,
    title: title,
    status: status,
    appliedDate: Date.now(),
  })
}

export async function idApplication(id) {
  let res;
  await JobApplication.findById(id).then(x => res = x);
  if (res === null) {
    throw new Error("No objects found");
  }
  return res;
}

// Returns all the jobs that matches the parameter description
export async function getApplication(company = "N/A", title = "N/A" , status = "N/A") {
  let result;

  const query = {};
  if (company !== "N/A") {
    query.company = company;
  }
  if (title !== "N/A") {
    query.title = title;
  }
  if (status !== "N/A") {
    query.status = status;
  }

  await JobApplication.find(query).then(jobs => {
    result = jobs;
  })
  return result;
}

export async function listAllApplication() {
  let result;
  await JobApplication.find({}).then(jobs => {
    result = jobs;
  })
  return result;
}
