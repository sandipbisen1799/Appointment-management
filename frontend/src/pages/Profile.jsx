import React, { useEffect, useState } from 'react'

import { profileApi } from '../services/auth.service';

const Profile = () => {
    const [profile, setProfile] = useState(null)

    const fetchProfile =async ()=>{
      try {
        const res = await profileApi();
        setProfile(res.user);

   
        
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      fetchProfile();
    },[])
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600">Name</label>
            <p className="text-gray-900 font-semibold">{profile?.name}</p>
          </div>
          <div>
            <label className="text-gray-600">Email</label>
            <p className="text-gray-900 font-semibold">{profile?.email}</p>
          </div>
          <div>
            <label className="text-gray-600">Account Type</label>
            <p className="text-gray-900 font-semibold">{profile?.accountType}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
