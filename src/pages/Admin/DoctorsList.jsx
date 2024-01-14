import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { message, Table } from 'antd';
import { getDoctors } from '../../requests/doctors';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctors();
      if (res.success) {
        setDoctors(res.data);
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
      title: 'First name',
      dataIndex: 'firstName',
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Speciality',
      dataIndex: 'speciality',
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
        dataSource={doctors}
      ></Table>
    </div>
  );
}

export default DoctorsList;
