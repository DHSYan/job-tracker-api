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
    // expect(res.body).toHaveProperty('_id');
    // expect(res.body.company).toBe('OpenAI');
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

});

// describe("GET /applications/listall", () => {
//   test('should retrieve all job applications', async () => {
//     await JobApplication.create([
//       { company: 'OpenAI', title: 'AI Engineer', status: 'applied', appliedDate: Date.now() },
//       { company: 'DeepMind', title: 'ML Engineer', status: 'interview', appliedDate: Date.now() }
//     ]);
//
//     const res = await request(app).get('/applications/listall');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBe(2);
//   })
// });

describe("PUT /application/:id", () => {
})

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
  })
})

