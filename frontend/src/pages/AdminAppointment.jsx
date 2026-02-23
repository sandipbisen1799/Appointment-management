import React, { useEffect, useState } from "react";
import {
  approveAppointmentsApi,
  getAllAppointmentsApi,
  rejectAppointmentsApi,
} from "../services/admin.service";
import { toast } from "react-toastify";
import Table from "../components/Table";
import { EllipsisVertical } from "lucide-react";

function AdminAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [emailFilter, setEmailFilter] = useState("");



  const fetchAppointments = async (email = null) => {
    try {
      const res = await getAllAppointmentsApi(email);
      if (res?.appointments) {
        setAppointments(res.appointments);
        setTotalAppointment(res.totalAppointment)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEmailFilter = (e) => {
    e.preventDefault();
    const email = emailFilter.trim() || null;
    fetchAppointments(email);
  };
  
  const handleClearFilter = () => {
    setEmailFilter("");
    fetchAppointments(null);
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
  const colomns = [
    {
      key: "index",
      label: "Index",
      render: (_, index) => index,
    },
    {
      key:'name',
      label:'Name'
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
      key:' isBooked',
      label:"booked",
     render: (row) => row?.isBooked ? (< h1 className="text-green-400">booked</h1>):(<h1 className=" text-red-400">not booked</h1>)
    },
    {
      key: "slot.time",
      label: "time",
    },
  ];

  return (
    // <div className="flex flex-col gap-4">
    //   <div className="bg-white rounded-lg shadow p-6">
    //     <h2 className="text-xl font-semibold text-gray-900">
    //       Appointments
    //     </h2>
    //     <p className="text-3xl font-bold text-green-600 mt-2">
    //       {appointments.length}
    //     </p>

    //     <div className="flex flex-col gap-4 mt-4">
    //       {appointments.map((appointment) => (
    //         <div
    //           key={appointment._id}
    //           className="border rounded-lg p-4 bg-gray-50"
    //         >
    //           {/* Service */}
    //           <p>
    //             <span className="font-semibold">Service:</span>{" "}
    //             {appointment?.service?.serviceName || "N/A"}
    //           </p>

    //           {/* Slot Time */}
    //           <p>
    //             <span className="font-semibold">Slot Time:</span>{" "}
    //             {appointment?.slot?.time || "Slot not assigned"}
    //           </p>

    //           {/* Slot Day */}
    //           <p>
    //             <span className="font-semibold">Slot Day:</span>{" "}
    //             {appointment?.slot?.date || "N/A"}
    //           </p>

    //           {/* Appointment Date */}
    //           <p>
    //             <span className="font-semibold">Appointment Date:</span>{" "}
    //             {appointment?.date
    //               ? new Date(appointment.date).toLocaleDateString()
    //               : "N/A"}
    //           </p>

    //           {/* Status */}
    //           <p>
    //             <span className="font-semibold">Status:</span>{" "}
    //             {appointment.status}
    //           </p>
    //           {
    //             appointment.status == 'Pending' ? (<>
    //             <button className="px-4 py-1 rounded-2xl text-green-500 bg-green-300 hover:bg-green-400" onClick={ handleApprove(appointment)}> Approve now</button>
    //             <button className="px-4 py-1 rounded-2xl text-red-500 bg-red-300 hover:bg-red-400 ml-2" onClick={handleReject(appointment)}> Reject now</button>
    //             </>):(<>
    //              <button className={`${appointment.status == 'Approved' ?'bg-green-300 hover:bg-green-400':'bg-red-300 hover:bg-red-400'} px-4 py-1 rounded-2xl bg-green-300 text-white`}> {appointment.status}</button>
    //             </>)
    //           }

    //           {/* Admin */}

    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <>
      <div
        className="flex flex-col gap-12 px-3 py-7"
        onClick={() => setOpenMenuId(null)}
      >
        <div className="w-full  bg-white py-3 flex-col  md:flex-row flex justify-between items-center gap-5 px-12 rounded-2xl">
          <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">
              Total Appointment
            </h1>
            <p className="text-2xl font-semibold text-gray-700">
              {appointments?.length}
            </p>
          </div>
          <div className="flex w-full flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">Approved</h1>
            <p className="text-2xl font-semibold text-gray-700">
              {appointments.filter((a) => a.status == "Approved").length}
            </p>
          </div>{" "}
            <div className="flex w-full flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">Pending</h1>
            <p className="text-2xl font-semibold text-gray-700">
              {appointments.filter((a) => a.status == "Pending").length}
            </p>
          </div>{" "}
          <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">Rejected</h1>
            <p className="text-2xl font-semibold text-gray-700">
              {appointments.filter((a) => a.status == "Rejected").length}
            </p>
          </div>
        </div>

        {/* Email Filter */}
        <div className="w-full bg-white py-3 flex items-center gap-4 px-4 rounded-2xl">
          <form onSubmit={handleEmailFilter} className="flex items-center gap-2 flex-1">
            <input
              type="email"
              placeholder="Filter by customer email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#705CC7]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#705CC7] text-white rounded-lg hover:bg-[#5a4aa8] transition-colors"
            >
              Filter
            </button>
            {emailFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <Table
          data={appointments}
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
              <h1
                className={statusStyles[appointment.status] ?? "text-gray-400"}
              >
                {appointment.status}
              </h1>
            );
          }}
          renderActions={(appointment) => (
            <div className="relative flex justify-center">
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
                <div className="absolute right-12 -top-2 font-normal mt-2 bg-white px-2 py-1 text-gray-500 border border-gray-200 min-w-40 flex flex-col shadow-lg rounded-lg z-[9999]">
                  <div
                    className="w-full p-2 rounded-lg hover:bg-[#F1F5F9] h-9 flex items-center cursor-pointer"
                    onClick={handleApprove(appointment)}
                  >
                    Approved
                  </div>

                  <div
                    className="w-full p-2 right-28  -top-2  rounded-lg hover:bg-[#F1F5F9] h-9 flex items-center cursor-pointer"
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
    </>
  );
}

export default AdminAppointment;
