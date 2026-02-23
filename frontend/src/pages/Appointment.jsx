
import { useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {
  getServiceSlot,
  getTimeSlot,
  submitFormAPI,
} from "../services/visitor.service";
import { getsettingAPI } from "../services/auth.service";
import { toast } from "react-toastify";
import api from "../utils/api.util";
import { handlePaymentFailureAPI } from "../services/payment.service";
const Appointment = () => {
  const Navigate =  useNavigate();
  const { adminName } = useParams();
  
  const [slots, setSlots] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [reference ,setReference] = useState('')
        const [ paymentSuccess, setPaymentSuccess]= useState(false)
  const [payload, setpayload] = useState({
    amount: "0",
    time: "no time is given",
  });
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [successBox, setSuccessBox] = useState(false);
  const [formData, setFormData] = useState({
    date: format(today, "yyyy-MM-dd"),
    serviceId: "",
    email: "",
    name: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
  });
  useEffect(() => {
    if (!adminName || !formData.date) return;
    (async () => {
      try {
        const slotRes = await getTimeSlot(adminName, formData.date);
        const serviceRes = await getServiceSlot(adminName);
        const setting = await getsettingAPI();
        const previousDate = new Date(today);
        const days = parseInt(setting?.setting?.dayNumber || 0, 10);
 
        previousDate.setDate(previousDate.getDate() - days);
        setSelectedDay(previousDate);
        setSlots(slotRes?.slots || []);
        // setAppointment(slotRes?.appointment);
        setServices(serviceRes?.services || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "error while getting the admin name",
        );
      }
    })();
  }, [adminName, formData.date]);
  const submitHandler = async () => {
    if (
      !formData.date ||
      !formData.serviceId ||
      !selectedSlotId ||
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      toast.error("all field are requiered ");
      return;
    }
    try {
      const res = await submitFormAPI(
        {
          ...formData,
          slotId: selectedSlotId,
        },
        adminName,
      );
      if (res?.success) {
        toast.success(res?.message);
        setAppointment(res?.appointment);
        setSuccessBox(true);
        setpayload({
          time: res?.slot?.time,
          price: res?.service?.price,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error submitting form");
    }
  };
  const calendarClassNames = {
    months: "flex justify-center",
    table: "w-full",
    row: "flex w-full",
    cell: "h-9 w-9 text-center",
    day: "h-9 w-9 rounded-full hover:bg-blue-100",
    day_today: "border border-blue-500",
    day_selected: "bg-blue-600 text-white",
    day_disabled: "text-gray-300",
  };
  const handlePayment = async (appointment) => {
    try {
      const { data } = await api.post("payment/create-order", {
        amount: payload.price,
        appointmentId : appointment._id ,
        adminName
         
      });
console.log(data)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: data.order.amount,
        currency: "INR",
        name: "Appointment System",
        description: "book your slot",
        order_id: data.order.id,
        prefill :{
          name: formData.name,
          email:formData.email,
          address:formData.address,
          country:formData.country,
         city: formData.city,
         pincode:formData.pincode
        },
        handler: async function (response) {
          // Verify payment
          const verify = await api.post("payment/verify", response);
          if (verify.data.success)
          { alert("Payment Successful 🎉"
          );
          setReference(verify?.data?.razorpay_payment_id)
          setSuccessBox(false)
          setPaymentSuccess(true);
        
        
          }
          else alert("Payment verification failed ❌");
        },
        // Handle payment cancellation (user closes modal)
        modal: {
          oncancel: async function () {
            try {
              await handlePaymentFailureAPI({
                razorpay_order_id: data.order.id,
                failure_reason: "Payment cancelled by user"
              });
              toast.error("Payment was cancelled");
            } catch (error) {
              console.error("Error marking payment as failed:", error);
            }
          }
        },
        
        theme: {
          color: "#121212",
        },
      };
      const rzp = new window.Razorpay(options);
      
      
      rzp.on("payment.failed", async function (response) {
        try {
          await handlePaymentFailureAPI({
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            failure_reason: response.error.description || "Payment failed"
          });
          toast.error(response.error.description || "Payment failed ❌");
        } catch (error) {
          console.error("Error marking payment as failed:", error);
        }
      });
      
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-indigo-100 px-3 sm:px-6 md:px-10  relative   py-6">
      <h1 className="text-2xl font-semibold text-gray-600 text-center mb-6">
        Appointment Form
      </h1>
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* CALENDAR */}
        <div className="flex flex-col gap-4">
          <span className="text-center font-medium">Select Date</span>
          <div className="relative rounded-2xl border bg-gray-100 p-4 shadow-sm overflow-hidden">
            <DayPicker
              mode="single"
              selected={new Date(formData.date)}
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  date: format(date, "yyyy-MM-dd"),
                })
              }
              disabled={{ before: selectedDay }}
              month={month}
              onMonthChange={setMonth}
              classNames={calendarClassNames}
            />
          </div>
        </div>
        {/* FORM + SLOTS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* SLOTS */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="block text-center font-medium mb-2">
              Available Slots
            </span>
            <div className="flex flex-wrap gap-2 justify-center text-center ">
              {slots.length === 0 ? (
                <p className=" text-xl capitalize text-center place-content-center    text-blue-400">
                  No slots available
                </p>
              ) : (
                slots.map((slot) => (
                  <div>
                    <>
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlotId(slot._id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          selectedSlotId === slot._id
                            ? "bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {slot.time || `${slot.startTime} - ${slot.endTime}`}
                      </button>
                    </>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Address", "address"],
              ["City", "city"],
              ["Country", "country"],
              ["Pincode", "pincode"],
            ].map(([label, key]) => (
              <label key={key} className="flex flex-col gap-1">
                <span>{label}</span>
                <input
                  className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </label>
            ))}
            {/* SERVICE */}
            <label className="flex flex-col gap-1 md:col-span-2">
              <span>Select Service</span>
              <select
                className="border px-4 py-2 rounded-md w-full"
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
              >
                <option value="">Select service</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* SUBMIT */}
          <button
            onClick={submitHandler}
            className="w-full md:w-fit self-center px-8 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Submit Form
          </button>
        </div>
      </div>
      {successBox && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-[#F0F2F8]/50 z-40"
            onClick={() => setSuccessBox(false)}
          />
          {/* Modal Container */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
            <div
              className="w-full min-w-166 min-h-62  flex flex-col gap-5 bg-[#F0F2F8]  rounded-lg shadow-lg p-6"
              // onClick={(e) => e.stopPropagation()} // 🔥 KEY LINE
            >
              <div className=" gap-3  flex  flex-col bg-[#FFFFFF] p-4 rounded-lg w-full items-between justify-between">
                <div className="flex flex-col ">
                  <h1 className="text-gray-600 font-bold text-2xl">
                    Rs {payload?.price}
                  </h1>
                  <h1 className="text-gray-400 font-medium text-sm">
                    {appointment?.date}{" "}
                  </h1>
                </div>
                <h1 className="text-gray-600 font-semibold text-xl  ">
                  Name : <span>{appointment?.name}</span>
                </h1>
                <h1 className="text-gray-600 font-semibold text-xl  ">
                  Email : <span>{appointment?.email}</span>
                </h1>{" "}
                <h1 className="text-gray-600 font-semibold text-xl  ">
                  Address : <span>{appointment?.address}</span>
                </h1>
                <h1 className="text-gray-600 font-semibold text-xl  ">
                  Slot Time : <span>{payload?.time}</span>
                </h1>
              </div>
              <div className=" gap-3  flex flex-col bg-[#FFFFFF] p-4 rounded-lg w-full items-between justify-between">
                <h1 className="text-xl font-semibold text-gray-800">
                  Your Appointment is booked Successfully{" "}
                </h1>
                <h1 className="text-sm font-semibold text-gray-700 ">
                  your appointment status is {appointment?.status || "pending "}
                  pay the service amount to confirm your booking the slot
                </h1>
                <button
                  type="submit"
                  className=" bg-blue-600  capitalize  text-white py-2 rounded hover:bg-blue-700"
                  onClick={()=>handlePayment(appointment)}
                >
                  pay <span>{payload?.price} Rs</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {
        paymentSuccess && (
          <>
           <div
            className="fixed inset-0 bg-[#f0f2f84d] z-40"
            onClick={() => setPaymentSuccess(false)}
          />
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
            <div
              className="w-full  min-h-62  flex items-center flex-col gap-5 bg-[#F0F2F8]  rounded-lg shadow-lg p-8"
              // onClick={(e) => e.stopPropagation()} // 🔥 KEY LINE
            >
            <h1 className='text-2xl text-gray-900 font-semibold capitalize'> Payment successfull  </h1>
                      <h1 className='text-lg text-gray-700'> thank you for your payment your slot is booked now  </h1>
        </div>
        {
            reference && (
                <>
                    <div
              className="fixed inset-0 bg-black/10 z-40"
            
                    
            
            />
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
              <div className="w-full min-w-72 bg-gray-100 rounded-lg shadow-lg p-6">
                <h1 className='text-lg font-semibold text-gray-600'> Reference ID : <strong>{reference}</strong></h1>
              </div>
              </div>
                </>
            )
        }
    </div>
          </>
        )
      }
    </div>
  );
};
export default Appointment;
