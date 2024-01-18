import { Tabs } from 'antd';
import Appointments from './Appointments';
import ProfileInfo from './ProfileInfo';

const items = [
  {
    key: '1',
    label: 'Appointments',
    children: <Appointments />,
  },
  {
    key: '2',
    label: 'Profile',
    children: <ProfileInfo />,
  },
];

function Profile() {
  return (
    <div className='p-2'>
      <Tabs
        defaultActiveKey='1'
        items={items}
      />
    </div>
  );
}

export default Profile;
