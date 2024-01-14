import React from 'react';
import { Tabs } from 'antd';
import UsersList from './UsersList';
import DoctorsList from './DoctorsList';

const items = [
  {
    key: '1',
    label: 'Users',
    children: <UsersList />,
  },
  {
    key: '2',
    label: 'Doctors',
    children: <DoctorsList />,
  },
];

function Admin() {
  return (
    <div className='p-2'>
      <Tabs
        defaultActiveKey='1'
        items={items}
      />
    </div>
  );
}

export default Admin;
