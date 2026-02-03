import React from 'react'
import { useState } from 'react'
import { createServiceApi, getServiceApi } from '../services/admin.service';
import { useEffect ,useCallback } from 'react';
import Table from '../components/Table';
import { toast } from 'react-toastify';

const AdminMember = () => {
  
  const [modifyService, setmodifyService] = useState(false); 
  const [services,setservices] =useState([])
   const [formData, setFormData] = useState({
      serviceName :'',
       description : ''
      
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
       
  
    const handleAddService = async (event)=>{
      event.preventDefault();
     try {
       const response = await createServiceApi(formData);
       if(response){
         setmodifyService(false);
         fetchService();
         toast.success(response.message || 'service is created')
         
       }
     } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'somthing went wrong')
      
     }
    }
useEffect(() => {
  fetchService();
}, [fetchService]);
  return (
    <div className="flex flex-col bg-gray-50 items-center p-4 gap-3">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">{services.length || 0} </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900">Slots</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
        </div>
      </div>
      <div className=' w-full  flex flex-row justify-between'>
        <h1 className='text-xl text-semibold text-gray-700 capitalize'>services</h1>
        <button className='px-3 py-1 rounded-lg cursor-pointer capitalize bg-blue-400 hover:bg-blue-500' onClick={()=>setmodifyService(true)}>
          add the services
        </button>
      </div>

      {
        <Table  data={services} columns={[
          {
            key : 'serviceName',
            label :'serviceName'
          },
          {key :'description',
            label :'descriprtion'
          }
        ]}/>
      }


       {modifyService && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setmodifyService(false)}
          />

          {/* Modal Container */}
          <div className="fixed   z-50 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-xl font-semibold mb-4 text-center">
                Add Service
              </h1>

              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="Service name"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <textarea
                  onChange={handleChange}
                  type="text"
                  placeholder="description"
                  name="description"
                  value={formData.description}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />

             

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddService}
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
  )
}

export default AdminMember
