import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { message, Table } from 'antd';
import { getUsers } from '../../requests/users';

function UsersList() {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getUsers();
      if (res.success) {
        setUsers(res.data);
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
      ></Table>
    </div>
  );
}

export default UsersList;
