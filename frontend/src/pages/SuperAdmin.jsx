import React, { useState } from "react";
import { addAdminAPI, blockAdminAPI, fetchAdminAPI, unblockAdminAPI } from "../services/auth.service";
import { useEffect } from "react";
import Table from "../components/Table";

const TeamMember = () => {
  const [modifyAdd, setModifyAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [admins ,setadmins] = useState([])
  const [appointments, setAppointments] = useState([]);
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const fetchUsers = async ()=>{
      try {
        const res = await fetchAdminAPI();
        console.log(res);
        if(res){
          setadmins(res.admins);
          setAppointments(res.appointments);
        }

      } catch (error) {
        console.log(error)
      }
    }
      const handleAddAdmin = async (event) => {
    try {
      console.log(formData);
      event.preventDefault();
      const res = await addAdminAPI(formData);
      console.log(res);
      if (res) {
        setModifyAdd(false);
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      setModifyAdd(false);
    }
    
  
  };
  const handleblockUser = async (admin)=>{
try {
  const id = admin._id
  const res = blockAdminAPI(id);
  console.log(res);
  if(res){
    fetchUsers();
  }

  
} catch (error) {
  console.log(error)
}
  }
    const handleunblockUser = async (admin)=>{
try {
  const id = admin._id
  const res = unblockAdminAPI(id);
  console.log(res);
   if(res){
    fetchUsers();
  }
  
} catch (error) {
  console.log(error)
}
  }
useEffect(()=>{
      fetchUsers();
    },[])

  return (
    <div className="min-h-screen  flex flex-col items-center gap-4  ">
      {/* Header */}
      <div className="w-full flex py-1 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Superadmin Dashboard
        </h1>

        <button
          className="px-4 py-1 rounded-lg text-lg capitalize bg-blue-300 hover:bg-blue-400"
          onClick={() => setModifyAdd(true)}
        >
          Add Admin
        </button>
      </div>

      {/* Card */}
    <div className="flex gap-5  w-full ">  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900">Total Admins</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{admins.length || 0}</p>
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900">Total Appointments</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{appointments.length || 0}</p>
        </div>
      </div></div>
    {
      admins.length == 0 ? (<>
   <Table data={admins}
      columns={ [
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
      key: "email",
      label: "Email",
    },
  {
    key: "appointmentCount",
    label: "Appointments",
  },
  {
    key:'isblock'
,
    label: "block",
      render: (row) => (
    row.isblock ? (
      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-600">
        Blocked
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-600">
        Active
      </span>
    )
  ),

  },
]}
      
      />
      
      </>):(<><Table data={admins}
      
      columns={ [
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
    key: "email",
    label: "Email",
  },
    {
    key: "appointmentCount",
    label: "Appointments",
  },
  {
    key: "isblock",
    label: "block",
      render: (row) => (
    row.isblock ? (
      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-600">
        Blocked
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-600">
        Active
      </span>
    )
  ),

  },
]}
  renderExtra={(admin) => (

    admin.isblock ? (
    <div className=" ">
      <button
        onClick={() => handleunblockUser(admin)}
        className="bg-green-200 px-2 place-content-center text-center   py-1 rounded-lg hover:bg-green-300"
      >
        unblock user
  
      </button>
      </div>
    ):(<>
     <div className="">
      <button
        onClick={() => handleblockUser(admin)}
        className="bg-red-200 px-2 text-red-600 place-content-center text-center   py-1 rounded-lg hover:bg-red-300"
      >
        block user
  
      </button>
      </div>
    </>)
  )}

      
      
      /></>)
    }

      {/* MODAL */}
      {modifyAdd && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setModifyAdd(false)}
          />

          {/* Modal Container */}
          <div className="fixed   z-50 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-xl font-semibold mb-4 text-center">
                Add Admin
              </h1>

              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="name"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  type="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddAdmin}
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setModifyAdd(false)}
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
  );
};

export default TeamMember;
