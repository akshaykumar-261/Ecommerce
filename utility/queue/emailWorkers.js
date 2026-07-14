import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendRegistrationOtp } from "../sendRegistrationOtp.js";
new Worker(
  "emailQueue",
  async (job) => {
    try {
      console.log("Job Received:", job.data);

      const response = await sendRegistrationOtp(
        job.data.email,
        job.data.otp,
        job.data.name
      );

      console.log("Email Sent:", response);
    } catch (error) {
      console.error("Email Error:", error);
    }
  },
  { connection }
);