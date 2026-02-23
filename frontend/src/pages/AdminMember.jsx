import React, { useEffect } from "react";
import { useState } from "react";
import {
  approveAppointmentsApi,
  getnewlyAppointmentsApi,
  rejectAppointmentsApi,
} from "../services/admin.service";
import { toast } from "react-toastify";
import { EllipsisVertical } from "lucide-react";
import Table from "../components/Table";

const AdminMember = () => {
  const [slot, setSlots] = useState();
  const [service, setService] = useState();
  const [appointment, setAppointments] = useState([]);
  const [totalAppointment , setTotalAppointment] = useState(0);

  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchdata = async () => {
    try {
      const res = await getnewlyAppointmentsApi();
      setSlots(res.slot);
      setService(res.service);
      setAppointments(res.appointments);
      setTotalAppointment(res.totalAppointment)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);
  const colomns = [
    {
      key: "index",
      label: "Index",
      render: (_, index) => index,
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "service.serviceName",
      label: "service Name",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "date",
      label: "day",
    },
    {
      key: "slot.time",
      label: "time",
    },
  ];
  const handleApprove = (appointment) => async () => {
    try {
      const appointmentId = appointment._id;
      // Call your API to approve the appointment
      const res = await approveAppointmentsApi(appointmentId);

      if (res) {
        // Refresh the list of appointments
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
        toast.success(res.message || "Appointment rejected successfully");
      } else {
        throw new Error("Failed to reject appointment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 items-center p-4 gap-3" onClick={()=>setOpenMenuId(null)}>
      <div className="w-full  bg-white py-3 flex-col  md:flex-row flex justify-between items-center gap-5 px-12 rounded-2xl">
        <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
          <h1 className="text-gray-500 font-semibold  text-sm">
            Total  Appointment
          </h1>
          <p className="text-2xl font-semibold text-gray-700">
            {totalAppointment || 0}
          </p>
        </div>
         <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
          <h1 className="text-gray-500 font-semibold  text-sm">
            Today  Appointment
          </h1>
          <p className="text-2xl font-semibold text-gray-700">
            {appointment?.length || 0}
          </p>
        </div>
        <div className="flex w-full flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
          <h1 className="text-gray-500 font-semibold  text-sm">Service</h1>
          <p className="text-2xl font-semibold text-gray-700">
            {/* {appointments.filter((a) => a.status == "Approved").length}
             */}
            {service || 0}
          </p>
        </div>{" "}
        <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
          <h1 className="text-gray-500 font-semibold  text-sm">slot</h1>
          <p className="text-2xl font-semibold text-gray-700">
            {/* {appointments.filter((a) => a.status == "Rejected").length} */}
            {slot || 0}
          </p>
        </div>
      </div>
        <div className=' w-full   flex flex-row justify-between items-center p-4 '>
        <h1 className='text-2xl text-bold text-gray-700 capitalize'>Upcoming Appointment</h1>

      </div>
      <Table
        data={appointment}
        columns={colomns}
        renderActionsText={"Status"}
        renderExtraText={"Action"}
        renderExtra={(appointment) => {
          const statusStyles = {
            Approved: "text-green-400",
            Rejected: "text-red-400",
            Pending: "text-yellow-400",
          };

          return (
            <h1 className={statusStyles[appointment.status] ?? "text-gray-400"}>
              {appointment.status}
            </h1>
          );
        }}
        renderActions={(appointment) => (
          <div className="relative flex">
            <EllipsisVertical
              className="cursor-pointer text-[#705CC7]"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(
                  openMenuId === appointment._id ? null : appointment._id,
                );
              }}
            />

            {openMenuId === appointment._id && (
              <div className="absolute  right-28  -top-2  font-normal mt-2 bg-white px-2 py-1 text-gray-500 border border-gray-200 min-w-40 flex flex-col shadow-lg rounded-lg z-9999">
                <div
                  className="w-full p-2 rounded-lg hover:bg-[#F1F5F9] h-9 flex items-center cursor-pointer"
                  onClick={handleApprove(appointment)}
                >
                  Approved
                </div>

                <div
                  className="w-full p-2 rounded-lg hover:bg-[#F1F5F9] h-9 flex items-center cursor-pointer"
                  onClick={handleReject(appointment)}
                >
                  Rejected
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AdminMember;
