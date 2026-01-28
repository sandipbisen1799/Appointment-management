import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/contextApi.jsx'
import { signupApi } from '../services/auth.service.js';

const Signup = () => {
  const navigate = useNavigate();
    const {user,setUser ,islogin,setIslogin}= useApi();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
         const formData = { name, email, password };

         const response = await signupApi(formData);
         console.log("Signup successful:", response);
         if(response){
            setIslogin(true);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            if (response.user.accountType === 'admin') {
              navigate('/admin');
            } else if (response.user.accountType === 'superadmin') {
              navigate('/superadmin');
            }

         }
    } catch (error) {
        console.error("Signup failed:", error);

    }
   


    // Add signup logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  )
}

export default Signup
