import React from 'react'
import { Outlet } from 'react-router-dom'
import { useApi } from '../contexts/contextApi'
import { logoutApi } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Rootlayout = () => {
    const {setUser,setIslogin ,islogin} = useApi();

 const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        const res = await logoutApi();
        if (res) {
          localStorage.clear();
          setUser({
            id: '',
            name: '',
            email: '',
            accountType: '',
            isblock: false,
          });
          setIslogin(false);
          toast.success(res.message || 'Logout successful');
          navigate('/login');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Logout failed');
      }
    };
    
  return (
    <div className="min-h-screen w-full ">
      <nav className="bg-white shadow-md">
        <div className="  px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Appointment System</h1>
            </div>
            <div className="flex items-center space-x-4">
              
           {
    islogin ? (<>
    
      
              <a href="/signup" className="text-gray-600 hover:text-gray-900">profile</a>
               <a href="/login" className="text-gray-600 hover:text-gray-900" onClick={handleLogout}>Logout</a>
              </>):(<>
              
                 <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/signup" className="text-gray-600 hover:text-gray-900">signup</a></>)
           }
            </div>
          </div>
        </div>
      </nav>
      <main className="">
        <Outlet />
      </main>
    </div>
  )
}

export default Rootlayout
