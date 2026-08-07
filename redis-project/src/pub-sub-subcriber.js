import { Redis } from 'ioredis';

const subscriber = new Redis('redis://localhost:6380');

subscriber.subscribe('notification', (err) => {
  if (err) {
    console.error('Error subscribing to notification', err);
  }
  console.log(`Subscribed to notification`);
});

subscriber.on('message', (channel, message) => {
  setTimeout(() => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`Received on ${channel}:`, parsedMessage);
    } catch (err) {
      console.error('Error parsing message:', message, err);
    }
  }, 5000);
});
