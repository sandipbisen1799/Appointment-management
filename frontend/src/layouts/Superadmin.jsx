import React from 'react'
import { Outlet } from 'react-router-dom'
import PersistentDrawerLeft from '../components/drawer'

const SuperAdminLayout = () => {
  return (
    <PersistentDrawerLeft title="SuperAdmin" navUser="superadmin" >
      <div className="p-4">
        <Outlet />
      </div>
    </PersistentDrawerLeft>
  )
}

export default SuperAdminLayout
