import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin</h2>
        </div>
        <nav className="space-y-2 px-4">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/admin/profile" className="block px-4 py-2 rounded hover:bg-gray-700">Profile</Link>
             <Link to="/admin/addslot" className="block px-4 py-2 rounded hover:bg-gray-700">Add Slot</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
