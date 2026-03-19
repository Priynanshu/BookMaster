const Redis = require("ioredis"); // .default hata diya

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 10776, // String ko Number mein convert karein
    password: process.env.REDIS_PASSWORD,
  
    retryStrategy: (times) => Math.min(times * 50, 2000)
});

redis.on("connect", () => {
    console.log("Server is connected to Redis Cloud");
});

redis.on("error", (err) => {
    console.error("Redis Connection Error:", err.message);
});

module.exports = redis;