import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const redisClient = new Redis('redis://localhost:6380');

await mongoose.connect('mongodb://localhost:27017/local_practice_redis');

app.get('/redis', async (req, res) => {
  const replay = await redisClient.ping();
  res.json({
    message: 'Redis is working',
    replay,
  });
});

app.get('/mongo', async (req, res) => {
  const replay = await mongoose.connection.db.admin().ping();
  res.json({
    message: 'Mongo is working',
    replay,
    mongo: 'connected',
    database: mongoose.connection.name,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
