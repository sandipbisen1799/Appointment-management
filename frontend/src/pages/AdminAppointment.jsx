import React, { useEffect, useState } from "react";
import { approveAppointmentsApi, getAllAppointmentsApi, rejectAppointmentsApi } from "../services/admin.service";
import { toast } from "react-toastify";

function AdminAppointment() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointmentsApi();
      if (res?.appointments) {
        setAppointments(res.appointments);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleApprove = (appointment) => async () => {
    try {
        const appointmentId = appointment._id;
      // Call your API to approve the appointment
      const res = await approveAppointmentsApi(appointmentId);
      

      if (res) {
        fetchAppointments(); // Refresh the list of appointments
        toast.success(res.message || "Appointment approved successfully");
      } else {
        throw new Error("Failed to approve appointment");
      }
    } catch (error) {
      console.error(error);
    }
  };
    const handleReject = (appointment) => async () => {
    try {
        const appointmentId = appointment._id;
      // Call your API to reject the appointment
      const res = await rejectAppointmentsApi(appointmentId);
      

      if (res) {
        fetchAppointments(); // Refresh the list of appointments
        toast.success(res.message || "Appointment rejected successfully");
      } else {
        throw new Error("Failed to reject appointment");
      }
    } catch (error) {
      console.error(error);
    }
  };    
    

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Appointments
        </h2>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {appointments.length}
        </p>

        <div className="flex flex-col gap-4 mt-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              {/* Service */}
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {appointment?.service?.serviceName || "N/A"}
              </p>

              {/* Slot Time */}
              <p>
                <span className="font-semibold">Slot Time:</span>{" "}
                {appointment?.slot?.time || "Slot not assigned"}
              </p>

              {/* Slot Day */}
              <p>
                <span className="font-semibold">Slot Day:</span>{" "}
                {appointment?.slot?.date || "N/A"}
              </p>

              {/* Appointment Date */}
              <p>
                <span className="font-semibold">Appointment Date:</span>{" "}
                {appointment?.date
                  ? new Date(appointment.date).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* Status */}
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {appointment.status}
              </p>
              {
                appointment.status == 'Pending' ? (<>
                <button className="px-4 py-1 rounded-2xl text-green-500 bg-green-300 hover:bg-green-400" onClick={ handleApprove(appointment)}> Approve now</button>
                <button className="px-4 py-1 rounded-2xl text-red-500 bg-red-300 hover:bg-red-400 ml-2" onClick={() => handleReject(appointment)}> Reject now</button>
                </>):(<>
                 <button className="px-4 py-1 rounded-2xl bg-green-300 text-white hover:bg-green-400"> Approved</button>
                </>)
              }

              {/* Admin */}
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAppointment;
