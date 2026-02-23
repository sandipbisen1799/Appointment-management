import dotenv from "dotenv";
dotenv.config();
const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
};
console.log(process.env.BREVO_API_KEY);
export default env;
