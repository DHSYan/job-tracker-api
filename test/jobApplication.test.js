const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Path to your Express app
const JobApplication = require('../models/JobApplication'); // Path to your Mongoose model

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
  await JobApplication.deleteMany(); // Clear before each test
});

describe('POST /application/new', () => {
  it('should create a job application with valid data', async () => {
    const res = await request(app).post('/application/new').send({
      company: 'OpenAI',
      title: 'AI Engineer',
      status: 'applied'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.company).toBe('OpenAI');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/jobapplications').send({
      title: 'AI Engineer'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/company/i);
  });

  it('should return 400 for invalid status value', async () => {
    const res = await request(app).post('/api/jobapplications').send({
      company: 'OpenAI',
      title: 'AI Engineer',
      status: 'invalid_status'
    });

    expect(res.statusCode).toBe(403);
  });
});

describe('GET /api/jobapplications', () => {
  it('should retrieve all job applications', async () => {
    await JobApplication.create([
      { company: 'OpenAI', title: 'AI Engineer', status: 'applied' },
      { company: 'DeepMind', title: 'ML Engineer', status: 'interview' }
    ]);

    const res = await request(app).get('/applications/get').send({
      company: 'OpenAI',
      title: 'AI Engineer',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

