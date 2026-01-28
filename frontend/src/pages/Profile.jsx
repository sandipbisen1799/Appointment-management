import React from 'react'
import { useApi } from '../contexts/contextApi';

const Profile = () => {
    const {user}= useApi();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600">Name</label>
            <p className="text-gray-900 font-semibold">{user?.name}</p>
          </div>
          <div>
            <label className="text-gray-600">Email</label>
            <p className="text-gray-900 font-semibold">{user?.email}</p>
          </div>
          <div>
            <label className="text-gray-600">Account Type</label>
            <p className="text-gray-900 font-semibold">{user?.accountType}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
