import emailjs from "@emailjs/browser";

const sendAppointmentEmail = (appointment, status) => {
  return emailjs.send(
    "service_04j3nxa",
    "template_ap1ymzk",
    {
      to_email: appointment?.user?.email, // user email
      user_name: appointment?.user?.name,
      service_name: appointment?.service?.serviceName,
      appointment_date: new Date(appointment.date).toLocaleDateString(),
      slot_time: appointment?.slot?.time,
      slot_date: appointment?.slot?.date,
      status: status,
      status_color: status === "Approved" ? "green" : "red",
    },
    "Ynm6WIJAf44QeZcz2H"
  );
};
export default sendAppointmentEmail ;