import React, { useRef, useState } from "react";
import { createServiceApi, getServiceApi ,deleteServiceAPI, updateServiceAPI } from "../services/admin.service";
import { useEffect, useCallback } from "react";
import Table from "../components/Table";
import { toast } from "react-toastify";
import { SquarePen, Trash } from "lucide-react";
function Service() {
  const [modifyService, setmodifyService] = useState(false);

  const [services, setservices] = useState([]);
  const [updateService ,setupdateService] = useState(false);
  const serviceId = useRef(null)
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
  });

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  const fetchService = useCallback(async () => {
    try {
      const res = await getServiceApi();
      setservices(res.service || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddService = async (event) => {
    event.preventDefault();
    if (!formData.price || !formData.serviceName || !formData.description) {
      toast.error("all field are required");
      return;
    }
    try {
      const response = await createServiceApi(formData);
      if (response) {
        setmodifyService(false);
        fetchService();
        toast.success(response.message || "service is created");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "somthing went wrong");
    }
  };
    const handleUpdateService = async (event) => {
    event.preventDefault();
    if (!formData.price || !formData.serviceName || !formData.description) {
      toast.error("all field are required");
      return;
    }
    try {
      console.log(serviceId)
      const response = await updateServiceAPI(serviceId.current, formData);
      if (response.success) {
        setupdateService(false);
        fetchService();
        toast.success(response.message || "service is created");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "somthing went wrong");
    }
  };
  useEffect(() => {
    fetchService();
  }, [fetchService]);
  const handleDeleteClick=  async(service)=>{
  console.log(service)
    try {
        const res = await deleteServiceAPI(service._id);
        fetchService();
    if(res.success)
      toast.success(res?.message );
      
    }
     catch (error) {
      console.log(error)
    }

  }
  return (
    <>
      <div className={`flex flex-col justify-between  gap-5  p-3 `}>
        <div className=" w-full   flex flex-row justify-between items-center p-4 ">
          <h1 className="text-2xl text-bold text-gray-700 capitalize">
            services
          </h1>
          <button
            className="px-6 py-2 rounded-lg text-white cursor-pointer capitalize bg-blue-400 hover:bg-blue-500"
            onClick={() => setmodifyService(true)}
          >
            Add Service
          </button>
        </div>
        
        <div className="w-full gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-xl font-medium">No services available</p>
              <p className="text-sm mt-1">Add a new service to get started</p>
            </div>
          ) : (
            services.map((service) => (
              <div 
                key={service._id} 
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Gradient Top Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                
                <div className="p-6">
                  {/* Icon & Title Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 capitalize group-hover:text-blue-600 transition-colors">
                          {service.serviceName}
                        </h3>
                        <p className="text-xs text-gray-400">{service.price} Rs</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{service.price}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setupdateService(true);
                        serviceId.current = service._id;
                        formData.serviceName = service.serviceName ;
                        formData.price = service.price ;
                        formData.description  = service.description ;
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm"
                    >
                      <SquarePen className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(service)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-sm border border-red-200"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))
          )}
        </div>
        
        {updateService && (
          <>
            <div
              className="fixed inset-0 bg-black/10 z-40"
              onClick={() => {setupdateService(false);
                setFormData({
                  serviceName : '',
                  price : '',
                  description : ''

                })

                
              }}
            />

            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
              <div className="w-full min-w-72 bg-gray-100 rounded-lg shadow-lg p-6">
                <h1 className="text-xl capitalize font-semibold mb-4 text-center">
                  update Service
                </h1>

                <form className="flex flex-col gap-3" onSubmit={handleUpdateService}>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    placeholder="Service name"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-400 outline-none"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="price"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-400 outline-none"
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-gray-700"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setupdateService(false)}
                      className="flex-1 border py-2 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {modifyService && (
          <>
            <div
              className="fixed inset-0 bg-black/10 z-40"
              onClick={() => {
                setmodifyService(false) ;
                 setFormData({
                  serviceName : '',
                  price : '',
                  description : ''

                })
                    
              }}
            />

            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
              <div className="w-full min-w-72 bg-gray-100 rounded-lg shadow-lg p-6">
                <h1 className="text-xl capitalize font-semibold mb-4 text-center">
                  Add Service
                </h1>

                <form className="flex flex-col gap-3" onSubmit={handleAddService}>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    placeholder="Service name"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-200 outline-none"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-200 outline-none"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="price"
                    className="border p-2 rounded focus:ring-2 focus:ring-gray-200 outline-none"
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setmodifyService(false)}
                      className="flex-1 border py-2 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Service;
