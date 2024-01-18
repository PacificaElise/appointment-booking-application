import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Button, Input, Space, Table, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { getDoctors, updateDoctor } from '../../requests/doctors';

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

  const changeStatus = async (payload) => {
    dispatch(ShowLoader(true));
    try {
      const res = await updateDoctor(payload);
      if (res.success) {
        message.success(res.message);
        getData();
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
      title: 'First name',
      dataIndex: 'firstName',
      ...getColumnSearchProps('firstName'),
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      ...getColumnSearchProps('lastName'),
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) =>
        a.email.localeCompare(b.email, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
      sorter: (a, b) => a.phone.length - b.phone.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Speciality',
      dataIndex: 'speciality',
      ...getColumnSearchProps('speciality'),
      sorter: (a, b) => a.speciality.length - b.speciality.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Pending',
          value: 'pending',
        },
        {
          text: 'Rejected',
          value: 'rejected',
        },
        {
          text: 'Approved',
          value: 'approved',
        },
        {
          text: 'Blocked',
          value: 'blocked',
        },
        {
          text: 'Unblocked',
          value: 'unblocked',
        },
      ],

      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        return text.toUpperCase();
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        if (record.status === 'pending' || record.status === 'unblocked') {
          return (
            <div className='flex gap-1'>
              <span
                className='underline cursor-pointer action'
                onClick={() => changeStatus({ ...record, status: 'rejected' })}
              >
                Reject
              </span>
              <span
                className='underline cursor-pointer action'
                onClick={() => changeStatus({ ...record, status: 'approved' })}
              >
                Approve
              </span>
            </div>
          );
        }

        if (record.status === 'rejected') {
          return (
            <div className='flex gap-1'>
              <span
                className='underline cursor-pointer action'
                onClick={() => changeStatus({ ...record, status: 'approved' })}
              >
                Approve
              </span>
            </div>
          );
        }

        if (record.status === 'approved') {
          return (
            <div className='flex gap-1'>
              <span
                className='underline cursor-pointer action'
                onClick={() => changeStatus({ ...record, status: 'blocked' })}
              >
                Block
              </span>
            </div>
          );
        }

        if (record.status === 'blocked') {
          return (
            <div className='flex gap-1'>
              <span
                className='underline cursor-pointer action'
                onClick={() => changeStatus({ ...record, status: 'unblocked' })}
              >
                Unblock
              </span>
            </div>
          );
        }
      },
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
