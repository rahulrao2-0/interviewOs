import { Worker } from "bullmq";
import redis from "../Redis.js";
import sendEmail from "../utils/sendEmail.js";

const emailWorker = new Worker(
  "SkillMatchingEmailQueue",

  async (job) => {

    console.log("Processing Job:", job.name);

    const { to, subject, html } = job.data;

    await sendEmail({
      to,
      subject,
      html,
    });

    console.log("Email Sent To:", to);
  },

  {
    connection: redis,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed`);
  console.log(err.message);
});