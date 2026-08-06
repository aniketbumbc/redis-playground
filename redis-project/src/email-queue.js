import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6380');

const QUEUE_KEY = 'queue:email';

/*
Add email to the queue from left to right
to: "abc@gmail.com", subject: "Hello", body: "Hello, how are you?"
createdAt: "1717731600000"

{
    "email": "abc@gmail.com",
    "subject": "Hello",
    "body": "Hello, how are you?",
    "createdAt": "1717731600000"
}
*/

app.post('/send-email', async (req, res) => {
  const { email, subject, body, createdAt = Date.now().toString() } = req.body;
  const job = JSON.stringify({ email, subject, body, createdAt });
  await redis.lpush(QUEUE_KEY, job);
  res
    .status(200)
    .json({ message: 'Email queued successfully', queued: true, job });
});

/*
Process email from the queue from right to left
*/

app.get('/process-email/process-one', async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.status(404).json({ message: 'No email to process' });
  }
  const job = JSON.parse(rawJob);
  const { email, subject, body, createdAt } = job;
  res
    .status(200)
    .json({ message: 'Email processed successfully', processed: true, job });
});

app.listen(3000, () => {
  console.log('Email queue server is running on port 3000');
});

// 1. Job loss , retry not possible, parallel processing not possible
