import React from 'react'
import { useEffect } from 'react'
import { getOrderAPI } from '../services/admin.service'
import { toast } from 'react-toastify';
import { useState } from 'react';
import Table from '../components/Table';

function Order() {
    const [order , setOrder] = useState([]);
    const fetchOrder = async ()=>{
try {
    const res =  await getOrderAPI();
    if(res?.success){
        setOrder(res?.order)
        toast.success(res?.message || 'order is fetched successfully ')

    }

} catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message || 'error while getting the order ')
    
    
}
    }
    useEffect(()=>{
        fetchOrder();
    }, [])
 const statusStyles = {
  created: "bg-yellow-100 text-yellow-600",
  failed: "bg-red-100 text-red-600",
  paid: "bg-green-100 text-green-600",
};
  const columns = [
  {
    key: "index",
    label: "index",
    render: (_, index) => index ,
  },
  {
    key: "name",
    label: "user name",
    render: (row) => row?.appointment?.name || "-",
  },
    {
    key: "service",
    label: "Service",
    render: (row) => row?.appointment?.service?.serviceName || "-",
  },
  {
    key: "price",
    label: "Price",
    render: (row) => row?.appointment?.service?.price || "-",
  },

  {
    key: "amount",
    label: "paid Ammont ",
  },

  
 
  {
    key: "time",
    label: "Time",
    render: (row) => row?.appointment?.slot?.time || "-",
  },
    {
    key: "status",
    label: "Status",
  render: (row) => {
  const status = row?.status;

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
  },
];

  return (
<>
   <div className={`flex flex-col justify-between  gap-5  p-3 `}>
        <div className=" w-full   flex flex-row justify-between items-center p-4 ">
          <h1 className="text-2xl text-bold text-gray-700 capitalize">
            orders
          </h1>
          
        </div>
         <div className="w-full  bg-white py-3 flex-col  md:flex-row flex justify-between items-center gap-5 px-12 rounded-2xl">
          <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">
              Total order
            </h1>
            <p className="text-2xl font-semibold text-gray-700">
              {order?.length}
            </p>
          </div>
          <div className="flex w-full flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">Added order </h1>
            <p className="text-2xl font-semibold text-gray-700">
              {order?.filter((a) => a.status == "created").length}
            </p>
          </div>{" "}
            <div className="flex w-full flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">failed</h1>
            <p className="text-2xl font-semibold text-gray-700">
              {order?.filter((a) => a.status == "failed").length}
            </p>
          </div>{" "}
          <div className="flex w-full  flex-col border  py-3.5 px-7 border-dashed rounded-xl border-gray-300  items-left justify-center">
            <h1 className="text-gray-500 font-semibold  text-sm">paid</h1>
            <p className="text-2xl font-semibold text-gray-700">
              {order.filter((a) => a.status == "paid").length}
            </p>
          </div>
        </div>
        <Table data={order} columns={columns}/>
        </div>
</>
  )
}

export default Order