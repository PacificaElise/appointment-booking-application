import { useState, useRef, useEffect } from 'react';
import { Button, Input, Space, Table, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import {
  getAllAppointments,
  getDoctorAppointments,
  getUserAppointments,
} from '../../requests/books';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      ...getColumnSearchProps('date'),
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Time',
      dataIndex: 'slot',
      ...getColumnSearchProps('slot'),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      ...getColumnSearchProps('doctorName'),
      sorter: (a, b) => a.doctorName.length - b.doctorName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Patient',
      dataIndex: 'userName',
      ...getColumnSearchProps('userName'),
      sorter: (a, b) => a.userName.length - b.userName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Booked At',
      dataIndex: 'bookedOn',
      ...getColumnSearchProps('bookedOn'),
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      if (user.role === 'doctor') {
        const res = await getDoctorAppointments(user.id);
        if (res.success) {
          setAppointments(res.data);
          console.log(res.data);
          dispatch(ShowLoader(false));
        } else {
          dispatch(ShowLoader(false));
          throw new Error(res.message);
        }
      } else if (user.role === 'admin') {
        const res = await getAllAppointments();
        if (res.success) {
          setAppointments(res.data);
          console.log(res.data);
          dispatch(ShowLoader(false));
        } else {
          dispatch(ShowLoader(false));
          throw new Error(res.message);
        }
      } else {
        const res = await getUserAppointments(user.id);
        if (res.success) {
          setAppointments(res.data);
          console.log(res.data);
          dispatch(ShowLoader(false));
        } else {
          dispatch(ShowLoader(false));
          throw new Error(res.message);
        }
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={appointments || []}
      ></Table>
    </div>
  );
}

export default Appointments;
