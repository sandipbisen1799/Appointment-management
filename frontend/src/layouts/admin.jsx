import React from 'react';
import { Outlet } from 'react-router-dom';
import PersistentDrawerLeft from '../components/drawer';

const AdminLayout = () => {
  return (
    <PersistentDrawerLeft
      navUser="admin"
      title="Appointment System"
      data={['Slot', 'Appointment','Service']}
    >
      <div className="w-full max-w-full overflow-x-hidden">
        <Outlet />
      </div>
    </PersistentDrawerLeft>
  );
};

export default AdminLayout;
