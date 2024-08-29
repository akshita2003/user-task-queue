const express = require('express');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Setup Redis client
const redisClient = new Redis();

// Setup rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'task',
  points: 20, // 20 tasks
  duration: 60, // Per minute per user ID
  blockDuration: 0, // Don't block, just queue
});

// Setup logger
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'task.log') })
  ]
});

// Task function
const task = async (user_id) => {
  const timestamp = Date.now();
  const logMessage = `${user_id}-task completed at-${timestamp}`;
  logger.info({ user_id, timestamp });
  console.log(logMessage);
};

// API Route
app.post('/task', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Rate limiting check
    await rateLimiter.consume(user_id);

    // Process task
    task(user_id);
    res.status(200).json({ message: 'Task processed' });

  } catch (rateLimiterRes) {
    // If rate limit exceeded, queue task
    setTimeout(() => task(user_id), 1000); // Queue task after 1 second
    res.status(202).json({ message: 'Task queued' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
