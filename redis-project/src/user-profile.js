import express from 'express';
import Redis from 'ioredis';
const app = express();
app.use(express.json());

const redis = new Redis('redis://localhost:6380');

app.post('/user/:id/json', async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.status(200).json({ message: 'User profile created successfully' });
});

app.get('/user/:id/json', async (req, res) => {
  const isUser = await redis.get(`user:${req.params.id}:json`);
  res.status(200).json({ user: isUser ? JSON.parse(isUser) : null });
});

app.post('/user/:id/hash', async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res
    .status(200)
    .json({ message: 'User profile created successfully with hash' });
});

app.get('/user/:id/hash', async (req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}:hash`);
  res.status(200).json({ user });
});

app.delete('user/:id/hash', async (req, res) => {
  await redis.del(`user:${req.params.id}:hash`);
  res
    .status(200)
    .json({ message: 'User profile deleted successfully with hash' });
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
