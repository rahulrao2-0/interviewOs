import { Queue } from "bullmq";
import redis from "../Redis.js";

const SkillMatchingEmailQueue = new Queue("SkillMatchingEmailQueue", {
  connection: redis,
});

export default SkillMatchingEmailQueue;