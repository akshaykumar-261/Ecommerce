import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendRegistrationOtp } from "../sendRegistrationOtp.js";
import { sendForgotOtp } from "../sendForgotPassOtp.js";

new Worker(
  "emailQueue",
  async (job) => {
    try {
      let response;

      switch (job.name) {
        case "registration":
          response = await sendRegistrationOtp(
            job.data.email,
            job.data.otp,
            job.data.name
          );
          break;

        case "forgot-password":
          response = await sendForgotOtp(
            job.data.email,
            job.data.otp,
            job.data.name
          );
          break;

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }

      console.log("Email Sent:", response);
    } catch (error) {
      console.error("Email Error:", error);
    }
  },
  { connection }
);