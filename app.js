import express from 'express';
import mongoose from 'mongoose';
import process from "node:process";
import jobRouter from './routes/jobRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
}

app.use('/applications', jobRouter);

app.get("/", (_, res) => {
  res.status(200).send("hello world!");
})

export default app;


