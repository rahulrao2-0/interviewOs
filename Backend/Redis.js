import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const redis = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});
// console.log(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("error", (err) => {
  console.log(err.message);
});

export default redis;

