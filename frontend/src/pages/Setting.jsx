import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import {settingAPI}from '../services/auth.service'
function Setting() {
     const [formData, setFormData] = useState({
       dayNumber:'0'
      });
    
      function handleChange(event) {
        const { name, type, value, checked } = event.target;
        setFormData((prevFormdata) => ({
          ...prevFormdata,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
    const Navigate =  useNavigate();
    const handleSubmit = async ()=>{
        try {
            
            const res= await  settingAPI(formData);
            if(res.success){
            toast.success('setting updated successfully ')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    
    <>
    <div className={`flex flex-col justify-between  gap-5  p-3 `}>
        <div className=" w-full   flex flex-row justify-between items-center p-4 ">
          <h1 className="text-2xl text-bold text-gray-700 capitalize">
            setting
          </h1>
          <button
            className="px-6 py-2 rounded-lg text-white cursor-pointer capitalize bg-blue-400 hover:bg-blue-500"
            onClick={() => Navigate('/admin/profile')}
          >
            profile
          </button>
        </div>
        <div className=' w-1/2 flex flex-col gap-1 '>
       <label htmlFor="dayNumber" className='flex flex-col gap-1  '>
        <h1 > Enter the number of days before the user can book his appointment</h1>
        <input type="number" className='border border-gray-600 p-1.5  rounded-md'  onChange={handleChange} value={formData.dayNumber} name="dayNumber" id="" />
       </label>
        <button
            className="px-6 py-2 rounded-lg text-white cursor-pointer capitalize bg-blue-400 hover:bg-blue-500"
            onClick={ handleSubmit}
          >
            submit
          </button>
        </div>
    </div>
    </>

  )
}

export default Setting