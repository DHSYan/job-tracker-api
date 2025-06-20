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

// describe('GET /api/jobapplications', () => {
//   it('should retrieve all job applications', async () => {
//     await JobApplication.create([
//       { company: 'OpenAI', title: 'AI Engineer', status: 'applied' },
//       { company: 'DeepMind', title: 'ML Engineer', status: 'interview' }
//     ]);
//
//     const res = await request(app).get('/applications/get').send({
//       company: 'OpenAI',
//       title: 'AI Engineer',
//     });
//
//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBe(2);
//   });
// });
