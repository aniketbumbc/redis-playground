import express from 'express';
import { Redis } from 'ioredis';

const app = express();
app.use(express.json());

const publisher = new Redis('redis://localhost:6380');

app.post('/notify', async (req, res) => {
  const {
    message,
    createdAt = Date.now().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    }),
  } = req.body;
  const notification = { message, createdAt };
  await publisher.publish('notification', JSON.stringify(notification));
  res.status(200).json({ message: 'Notification published successfully' });
});

app.listen(3000, () => {
  console.log('Pub-Sub API server is running on port 3000');
});
