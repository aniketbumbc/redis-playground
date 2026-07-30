import express from 'express';
import Redis from 'ioredis';
const app = express();
app.use(express.json());

const redis = new Redis('redis://localhost:6380');

const SITE_BANNER_KEY = 'app:site_banner';

app.post('/site-banner', async (req, res) => {
  await redis.set(
    SITE_BANNER_KEY,
    JSON.stringify(req.body.message || 'Welcome to the site!'),
  );
  res.status(201).json({ message: 'Site banner created successfully' });
});

app.get('/site-banner', async (req, res) => {
  const banner = await redis.get(SITE_BANNER_KEY);
  if (!banner) {
    return res.status(404).json({ message: 'Site banner not found' });
  }
  res.status(200).json({ message: banner });
});

app.delete('/site-banner', async (req, res) => {
  await redis.del(SITE_BANNER_KEY);
  res.status(200).json({ message: 'Site banner deleted successfully' });
});

app.get('/site-banner/exists', async (req, res) => {
  const exists = await redis.exists(SITE_BANNER_KEY);
  res.status(200).json(Boolean(exists));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
