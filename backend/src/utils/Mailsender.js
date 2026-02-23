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
  console.log(env.BREVO_API_KEY);
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



export const sendBulkEmail = async ({ admin,emails, subject, message }) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  console.log(env.BREVO_API_KEY);
  // API key
  client.authentications["api-key"].apiKey = env.BREVO_API_KEY;

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  // Get HTML template


  // Send email to each recipient
  const emailPromises = emails.map(async (email) => {
    const emailData = {
      to: [{ email: email }],
      subject: subject,

       templateId: 2,
 
      sender: {
        name: "Appointment System",
        email: admin.email || "noreply@example.com"
      },
       params: {
      message
    },
    };
    await tranEmailApi.sendTransacEmail(emailData);
  });

  await Promise.all(emailPromises);
};
