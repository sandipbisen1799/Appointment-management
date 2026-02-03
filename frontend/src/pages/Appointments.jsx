import { useParams } from "react-router-dom";
import { UserX } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  getServiceSlot,
  getTimeSlot,
  submitFormAPI,
} from "../services/visitor.service";
import { toast } from "react-toastify";

const Appointments = () => {
  const { adminName } = useParams();
  console.log("Admin Name from URL:", adminName); // For debugging

  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedSlotId, setSelectedSlotId] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: today,
    serviceId: "",
  });

  /* ---------------- FETCH SLOTS & SERVICES ---------------- */
  useEffect(() => {
    if (!adminName || !formData.date) return;

    const fetchData = async () => {
      try {
        const slotRes = await getTimeSlot(adminName, formData.date);
        const serviceRes = await getServiceSlot(adminName);

        setSlots(slotRes?.slots || []);
        setServices(serviceRes?.services || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Error fetching slots or services",
        );
      }
    };

    fetchData();
  }, [adminName, formData.date]);

  /* ---------------- HANDLE FORM SUBMIT ---------------- */
  const submitHandler = async () => {
    try {
      if (!formData.date || !formData.serviceId || !selectedSlotId) {
        alert("Please select date, service and slot");
        return;
      }

      const payload = {
        date: formData.date,
        serviceId: formData.serviceId,
        slotId: selectedSlotId,
      };
      console.log(adminName);
      const response = await submitFormAPI(payload, adminName);

      if (response) {
        console.log("Form submitted:", response);
        toast.success(response?.message || "form is submit");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response.data.message || "error while submiting the form",
      );
    }
  };



  const [month, setMonth] = useState(new Date());
  const calendarClassNames = {
    months: "flex justify-center",
    month: "space-y-4",
    caption: "flex justify-center items-center gap-2",
    caption_label: "text-sm font-semibold",
    table: "w-full border-collapse",
    head_row: "flex",
    head_cell: "text-gray-500 w-9 font-medium text-xs text-center",
    row: "flex w-full mt-2",
    cell: "h-9 w-9 text-center text-sm p-0 relative",
    day: "h-9 w-9 rounded-full hover:bg-blue-100 transition",
    day_today: "border border-blue-500 text-blue-600 font-semibold",
    day_selected: "bg-blue-600 text-white hover:bg-blue-600",
    day_disabled: "text-gray-300",
  };
  return (
    <>
      {" "}
      <div className="min-h-screen flex flex-col  gap-4   bg-gray-50">
        <h1 className="text-2xl text-center text-gray-500 font-semibold">
          Appointment Form
        </h1>
        <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-3  gap-2.5  items-center  justify-evenly p-4 w-full ">
          {" "}
          <div className="flex flex-col items-center gap-8  ">
            {" "}
            <label className="flex flex-col gap-2 ">
              <span className="font-medium items-center">Select Date</span>

              <div className="rounded-2xl border border-gray-200 bg-gray-100/50 p-4 shadow-sm w-fit relative">

                  {
                    formData.date !== today && (
                    <>
                    <div className=" absolute top-4 right-4">
                      <button
                        onClick={() => {
                          setMonth(today);
                          setFormData({
                            ...formData,
                            date: format(today, "yyyy-MM-dd"),
                          });
                        }}
                        className="mt-3 px-4 py-1.5 text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        Today
                      </button>
                    </div></>
                    )
                  }
                  
                <DayPicker
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    setFormData({
                      ...formData,
                      date: format(date, "yyyy-MM-dd"),
                    });
                  }}
                  disabled={{ before: today }}
                  hideNavigation
                  captionLayout="dropdown"
                  fromYear={2024}
                  toYear={2035}
                  month={month}
                  onMonthChange={setMonth}
                  classNames={calendarClassNames}
                
                />
              </div>
            </label>
          </div>{" "}
          <div className=" flex flex-col gap-8  ">

            {" "}
            <label className="flex  bg-gray-100 p-3.5 rounded-lg flex-col items-center gap-2">
              <span>Available Slots</span>

              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">No slots available</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlotId(slot._id)}
                      className={`px-2 py-1 rounded-lg text-white ${
                        selectedSlotId === slot._id
                          ? "bg-green-600"
                          : "bg-blue-500"
                      }`}
                    >
                      {slot.time || `${slot.startTime} - ${slot.endTime}`}
                    </button>
                  ))}
                </div>
              )}
            </label>
            {/* Services */}
            <label className="flex flex-col gap-1">
              <span>Select Service</span>

              <select
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceId: e.target.value,
                  }))
                }
                className="border px-4 py-2 rounded-md"
              >
                <option value="">Select the service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>

              {services.length === 0 && (
                <p className="text-sm text-gray-500">No services available</p>
              )}
            </label>
            {/* Submit */}
            <button
              onClick={submitHandler}
              className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Date */}

        {/* Slots */}
      </div>
    </>
  );
};

export default Appointments;
