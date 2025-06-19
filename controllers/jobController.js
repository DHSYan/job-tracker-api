import JobApplication from "../models/JobApplication.js";
import { isValidStatus } from "../enums/applicationStatus.js";

export async function createApplication(company, title, status = "applied", notes = []) {
  await JobApplication.create({
    company: company,
    title: title,
    status: status,
    appliedDate: Date.now(),
    notes: notes 
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

export function deleteApplication(company, title) {
  return JobApplication.deleteOne({ company, title });
}

export async function deleteApplicationById(id) {
  return await JobApplication.findByIdAndDelete(id);
}

function validUpdate(update) {
  const keys = Object.keys(update);

  let result = true;

  keys.forEach(key => {
    if (
      key !== "status" || 
      key !== "company" || 
      key !== "appliedDate" || 
      key !== "title" ||
      key !== "notes" ) {
      return false;
    }
  });

  if (keys.includes("status")) {
    result = isValidStatus(update["status"]);
  }

  return result;
}

export async function idApplicationAndUpdate(id, update) {
  if (!validUpdate(update)) {
    throw new Error("invalid update body or status type");
  }

  const res = await JobApplication.findByIdAndUpdate(
    id, 
    update, 
    { new : true }
  );
  return res;
}

export async function idApplicationNoteAppend(id, note) {
  // get the current notes
  // let res;
  // await JobApplication.findById(id).then(x => res = x.toObject());
  // console.log("the note is " + note);
  let res = await JobApplication.findById(id);
  // console.log(res)
  const notes = res["notes"];
  // console.log(notes)
  notes.push(note)
  // console.log("!!!!!!!! updated " + notes)

  res = await JobApplication.findByIdAndUpdate(
    id,
    { notes: notes },
    { new: true }
  )
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

export function suggestion() {
  // this in the future could be an actual API call to open AI's 
  // API but for now it will only return a mock suggetion
  return "this is a mocked AI response, in the future this can be replaced by an actual call to an AI API"
}
