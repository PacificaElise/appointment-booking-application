import { useEffect, useState } from 'react';
import { message, Tabs } from 'antd';
import UsersList from './UsersList';
import DoctorsList from './DoctorsList';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { getUserById } from '../../requests/users';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();

  const checkAdmin = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getUserById(user.id);
      if (res.success && res.data.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        throw new Error('You are not an admin');
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isAdmin && (
      <div className='p-2'>
        <Tabs
          defaultActiveKey='1'
          items={items}
        />
      </div>
    )
  );
}

export default Admin;
