import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const SuperAdminLayout = () => {
  return (
    <div className="flex w-full h-screen bg-blue-400">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">SuperAdmin</h2>
        </div>
        <nav className="space-y-2 px-4">
          <Link to="/superadmin" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/superadmin/profile" className="block px-4 py-2 rounded hover:bg-gray-700">Profile</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default SuperAdminLayout
