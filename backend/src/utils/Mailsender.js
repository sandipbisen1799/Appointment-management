import env from "../config/env.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async ({
  serviceName,
  adminEmail,
  slotDay,
  slotTime,
  appointmentEmail,
  status,
}) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  // API key
  client.authentications["api-key"].apiKey = env.BREVO_API_KEY;

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const emailData = {
    to: [{ email: appointmentEmail }],
    templateId: 1, // 👈 your template ID
    params: {
      serviceName,
      slotDay,
      slotTime,
      appointmentEmail,
      adminEmail,
      status,
    },
  };

  await tranEmailApi.sendTransacEmail(emailData);
};
