import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js'; 
import JobApplication from '../models/JobApplication.js'; 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 3000
    }
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await JobApplication.deleteMany(); 
});

describe("/", () => {
  test("should return hello world", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
  })
})

describe('POST /applications', () => {
  test('should create a job application with valid data', async () => {
    const res = await request(app).post('/applications').send({
      company: 'OpenAI',
      title: 'AI Engineer',
      status: 'applied'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Sucess');
  });

  test('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/applications').send({
      title: 'AI Engineer'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/company/i);
  });

  test('should return 400 for invalid status value', async () => {
    const res = await request(app).post('/applications').send({
      company: 'OpenAI',
      title: 'AI Engineer',
      status: 'invalid_status'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/status/i);
  });
});

describe('GET /applications', () => {
  test('should retrieve all job applications', async () => {
    await JobApplication.create([
      { company: 'OpenAI', title: 'AI Engineer', status: 'applied', appliedDate: Date.now() },
      { company: 'DeepMind', title: 'ML Engineer', status: 'interview', appliedDate: Date.now() }
    ]);

    let res = await request(app).get('/applications').send({
      company: 'OpenAI',
      title: 'AI Engineer',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    res = await request(app).get('/applications');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

  });
});

describe("GET /applications/:id", () => {

  test("Retrieval of an object that exists", async () => {
    const job = await JobApplication.create(
      { company: 'OpenAI', title: 'AI Engineer', status: 'applied', appliedDate: Date.now() },
    )

    const res = await request(app).get(`/applications/${job._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(JSON.stringify(res.body._id)).toBe(JSON.stringify(job._id));
    expect(res.body.company).toBe('OpenAI');
    expect(res.body.title).toBe('AI Engineer');
  })


  test("Retrievl of an ojbect that doesn't exists", async () => {
    const res = await request(app).get("/applications/1234");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe("no such application with '1234' was found");
  })
});

describe("GET /applications/:id/suggestion", () => {

  test("we should get a mocked response answer", async () => {
    const res = await request(app).get("/applications/1234/suggestion");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("this is a mocked AI response, in the future this can be replaced by an actual call to an AI API");
  });
})

describe('PUT /applications/:id', () => {
  test('updates a job application and returns success', async () => {
    const job = await JobApplication.create({
      company: 'OpenAI',
      title: 'Researcher',
      status: 'applied', 
      appliedDate: Date.now()
    });

    const res = await request(app)
      .put(`/applications/${job._id}`)
      .send({ status: 'interview' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("success");

    const updated = await JobApplication.findById(job._id);
    expect(updated.status).toBe("interview");
  });

  test('returns 400 for invalid update (bad field)', async () => {
    const job = await JobApplication.create({
      company: 'OpenAI',
      title: 'Researcher',
      status: 'applied',
      appliedDate: Date.now()
    });

    const res = await request(app)
      .put(`/applications/${job._id}`)
      .send({ salary: 200000 }); // salary is not an allowed field

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid update/i);
  });

  test('returns 400 if ID is invalid', async () => {
    const res = await request(app)
      .put(`/applications/invalid-id`)
      .send({ status: 'applied' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid ID/i);
  });

  it('returns 400 if ID not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/applications/${fakeId}`)
      .send({ status: 'applied' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid ID/i); // depends on your controller behavior
  });
});

describe("PUT /application/:id/new-note ", () => {
})

describe("DELETE /application/:id", () => {
  test ("database should see no additional objects", async () => {
    const job = await JobApplication.create(
      { company: 'OpenAI', title: 'AI Engineer', status: 'applied', appliedDate: Date.now() },
    )

    const listallRes = await request(app).get('/applications');
    expect(listallRes.body.length).toBe(1);

    await request(app).delete('/applications/' + job._id);

    const res = await request(app).get('/applications');
    expect(res.body.length).toBe(0);

    // Deleteing again shouldn't cause any error
    await request(app).delete('/applications/' + job._id);
    const res2 = await request(app).get('/applications');
    expect(res2.body.length).toBe(0);
  })


  test("deleting something that doesn't exists shouldn't cause any error", async () => {
    const job = await JobApplication.create(
      { company: 'OpenAI', title: 'AI Engineer', status: 'applied', appliedDate: Date.now() },
    )

    const listallRes = await request(app).get('/applications');
    expect(listallRes.body.length).toBe(1);

    await request(app).delete('/applications/' + 1238750918723);

    const res = await request(app).get('/applications');
    expect(res.body.length).toBe(1);
  })
})

