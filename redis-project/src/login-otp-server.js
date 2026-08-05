import express from 'express';
import Redis from 'ioredis';
const app = express();
app.use(express.json());

const redis = new Redis('redis://localhost:6380');

const getOTPKey = (phone) => {
  return `otp:${phone}`;
};

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(getOTPKey(phone), otp, 'EX', 30); // 30 seconds
  res.status(200).json({ message: 'OTP sent successfully', otp });
});

app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const storedOTP = await redis.get(getOTPKey(phone));
  if (!storedOTP) {
    return res.status(400).json({ message: 'OTP expired' });
  }
  if (storedOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  } else {
    await redis.del(getOTPKey(phone));
    return res.status(200).json({ message: 'OTP verified successfully' });
  }
});

app.get('/otp/:phone/ttl', async (req, res) => {
  const ttl = await redis.ttl(getOTPKey(req.params.phone));
  return res.status(200).json({ ttl });
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
