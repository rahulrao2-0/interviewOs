// config/redis.js
import { createClient } from "redis";

const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

await redis.connect();

console.log("✅ Redis Connected");

export default redis;