/**
 *  Consumer is the worker that processes the jobs from the queue
 * constanlty monitoring the queue and processing the jobs
 */

import { Worker } from 'bullmq';
import { connection } from './queue.js';

const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    console.log('Processing email', job);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const { to, subject, body } = job.data;
    console.log(
      `Processing email to ${to} with subject ${subject} and body ${body}`,
    );
  },
  { connection },
);

/**
 *  Add a listener to the worker to log the completed jobs
 */
emailWorker.on('completed', (job) => {
  console.log(`Email sent successfully to ${job.data.to}`);
});

/**
 *  Add a listener to the worker to log the failed jobs
 */
emailWorker.on('failed', (job, error) => {
  console.log(`Email sending failed to ${job.data.to} with error ${error}`);
});
