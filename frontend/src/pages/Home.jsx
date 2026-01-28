import { CircleX } from "lucide-react";
import React from "react";

const Home = () => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="min-h-screen flex flex-col items-center gap-3.5 bg-gray-50">
      <h1 className="text-2xl text-gray-500 font-semibold">form</h1>

      <div className="h-full  bg-white rounded-2xl flex flex-col p-4 gap-2 ">
        <label className="flex flex-col gap-1 " htmlFor=" date">
          <h1 className="">Select Date</h1>
          <input
            className="w-full px-6 py-2 border   border-gray-100 rounded-lg "
            name="date"
            type="date"
            min={today}
          />
        </label>
        <label className="flex flex-col gap-1 " htmlFor=" date">
          <h1 className="">Slot</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
              9:00 10:00 AM
              <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                <CircleX size={16} />
              </div>
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
              10:00 11:00 AM
              <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                <CircleX size={16} />
              </div>
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
              11:00 12:00 AM
              <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                <CircleX size={16} />
              </div>
            </button>
          </div>
        </label>
        <label className="flex flex-col gap-1"  htmlFor="services"> Select Service
        <select name="services" id="">
            <option value="">1  first service</option>
            <option value="">2 second service</option>
            <option value="">3 third service</option>
        </select>
        </label>
      

      </div>
    </div>
  );
};

export default Home;
