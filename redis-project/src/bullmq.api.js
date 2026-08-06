import express from 'express';
import { emailQueue } from './queue.js';

const app = express();
app.use(express.json());

app.post('/welcome-email', async (req, res) => {
  const { to, subject, body } = req.body;
  const job = await emailQueue.add(
    'email-job-welcome',
    {
      to,
      subject,
      body,
    },
    {
      delay: 1000,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  );

  res.status(200).json({ message: 'Email queued successfully', jobId: job.id });
});

app.listen(3000, () => {
  console.log('BullMQ API server is running on port 3000');
});
