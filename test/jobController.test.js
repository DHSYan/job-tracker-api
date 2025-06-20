import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import JobApplication from '../models/JobApplication.js';
import {
  createApplication,
  idApplication,
  deleteApplication,
  deleteApplicationById,
  idApplicationAndUpdate,
  idApplicationNoteAppend,
  getApplication,
  listAllApplication,
  suggestion,
  validUpdate
} from '../controllers/jobController.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await JobApplication.deleteMany();
  await createApplication("OpenAI", "Engineer", "applied");
  await createApplication("Google", "Engineer", "interview");
  await createApplication("Google", "PM", "applied");
});

describe('validUpdate()', () => {
  it('returns true for valid fields and valid status', () => {
    const update = { status: 'applied', company: 'OpenAI' };
    expect(validUpdate(update)).toBe(true);
  });

  it('returns false for invalid field names', () => {
    const update = { salary: 120000 };
    expect(validUpdate(update)).toBe(false);
  });

  it('returns false for invalid status value', () => {
    const update = { status: 'unknown' };
    expect(validUpdate(update)).toBe(false);
  });

  it('returns true if status is valid even with other valid fields', () => {
    const update = {
      status: 'interview',
      company: 'OpenAI',
      title: 'Engineer',
      notes: ['very promising'],
      appliedDate: Date.now(),
    };
    expect(validUpdate(update)).toBe(true);
  });

  it('returns false if mixed valid and invalid fields', () => {
    const update = { status: 'applied', foo: 'bar' };
    expect(validUpdate(update)).toBe(false);
  });

  it('returns true if update has no status but only other valid keys', () => {
    const update = { company: 'Google', title: 'SWE' };
    expect(validUpdate(update)).toBe(true);
  });
});

describe('Job Application Controller', () => {

  test('creates a job application', async () => {
    await createApplication("OpenAI", "Engineer", "applied");
    const jobs = await JobApplication.find({});
    expect(jobs.length).toBe(4); // 1 + 3, along with the three created beforeEach
    expect(jobs[0].company).toBe("OpenAI");
  });

  test('retrieves a job application by ID', async () => {
    const job = await JobApplication.create({ company: "TestCo", title: "Tester", status: "applied", appliedDate: Date.now() });
    const res = await idApplication(job._id);
    expect(res.company).toBe("TestCo");
  });

  test('throws an error if ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(idApplication(fakeId)).rejects.toThrow("No objects found");
  });

  test('deletes a job by company and title', async () => {
    await createApplication("DeleteCo", "DeleteRole");
    const res = await deleteApplication("DeleteCo", "DeleteRole");
    expect(res.deletedCount).toBe(1);
  });

  test('deletes a job by ID', async () => {
    const job = await JobApplication.create({ company: "Zeta", title: "Dev", status: "applied", appliedDate: Date.now() });
    const res = await deleteApplicationById(job._id);
    const check = await JobApplication.findById(job._id);
    expect(check).toBeNull();
  });
  
  test("deletes something that doesn't exists", async () => {
    const res = await deleteApplicationById(123); 
    expect(res["error"]).toBe("invalid ID");
  })

  test('updates a job application with valid fields', async () => {
    const job = await JobApplication.create({ company: "UpdateCo", title: "Title", status: "applied", appliedDate: Date.now() });
    const updated = await idApplicationAndUpdate(job._id, { status: "interview" });
    expect(updated.status).toBe("interview");
  });

  test('throws on invalid update fields', async () => {
    const job = await JobApplication.create({ company: "FailCo", title: "Title", status: "applied", appliedDate: Date.now() });
    await expect(idApplicationAndUpdate(job._id, { salary: 123 })).rejects.toThrow("invalid update body or status type");
  });

  test('appends a note to an application', async () => {
    const job = await JobApplication.create({ company: "NotesInc", title: "Writer", status: "applied", appliedDate: Date.now(), notes: [] });
    await idApplicationNoteAppend(job._id, "Great interviewer");
    const updated = await JobApplication.findById(job._id);
    expect(updated.notes).toContain("Great interviewer");
  });


  test('lists all applications', async () => {
    await createApplication("Comp1", "A");
    await createApplication("Comp2", "B");
    const all = await listAllApplication();
    expect(all.length).toBe(2+3);
  });

  test('returns a mocked suggestion', () => {
    expect(suggestion()).toMatch(/mocked AI/i);
  });

});

describe("getApplication()", () => {

  test("returns all when all params are 'N/A'", async () => {
    const res = await getApplication();
    expect(res.length).toBe(3);
  });

  test("filters by company only", async () => {
    const res = await getApplication("Google", "N/A", "N/A");
    expect(res.length).toBe(2);
    res.forEach(job => expect(job.company).toBe("Google"));
  });

  test("filters by title only", async () => {
    const res = await getApplication("N/A", "Engineer", "N/A");
    expect(res.length).toBe(2);
    res.forEach(job => expect(job.title).toBe("Engineer"));
  });

  test("filters by status only", async () => {
    const res = await getApplication("N/A", "N/A", "applied");
    expect(res.length).toBe(2);
    res.forEach(job => expect(job.status).toBe("applied"));
  });

  test("filters by company and title", async () => {
    const res = await getApplication("Google", "PM", "N/A");
    expect(res.length).toBe(1);
    expect(res[0].title).toBe("PM");
  });

  test("filters by company and status", async () => {
    const res = await getApplication("Google", "N/A", "interview");
    expect(res.length).toBe(1);
    expect(res[0].status).toBe("interview");
  });

  test("filters by title and status", async () => {
    const res = await getApplication("N/A", "Engineer", "applied");
    expect(res.length).toBe(1);
    expect(res[0].company).toBe("OpenAI");
  });

  test("filters by all three parameters", async () => {
    const res = await getApplication("Google", "PM", "applied");
    expect(res.length).toBe(1);
    expect(res[0].company).toBe("Google");
  });

  test('retrieves job applications by filters', async () => {
    await createApplication("Alpha", "Eng", "applied");
    await createApplication("Alpha", "Eng", "interview");
    const results = await getApplication("Alpha", "Eng", "applied");
    expect(results.length).toBe(1);
    expect(results[0].status).toBe("applied");
  });

});
