import { useState, useRef, useEffect } from 'react';
import { Button, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import {
  getAllAppointments,
  getDoctorAppointments,
  getUserAppointments,
  updateAppointmentStatus,
} from '../../requests/books';
import Table from 'ant-responsive-table';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));

  const getData = async () => {
    dispatch(ShowLoader(true));
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      if (user.role === 'doctor') {
        const res = await getDoctorAppointments(user.id);
        if (res.success) {
          setAppointments(res.data);
        } else {
          throw new Error(res.message);
        }
      } else if (user.role === 'admin') {
        const res = await getAllAppointments();
        if (res.success) {
          setAppointments(res.data);
        } else {
          throw new Error(res.message);
        }
      } else {
        const res = await getUserAppointments(user.id);
        if (res.success) {
          setAppointments(res.data);
        } else {
          throw new Error(res.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdate = async (id, status) => {
    dispatch(ShowLoader(true));
    try {
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        message.success(res.message);
        getData();
      } else throw new Error(res.message);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  const dataSource = appointments || [];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',

      ...getColumnSearchProps('date'),
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Time',
      dataIndex: 'slot',
      key: 'slot',

      ...getColumnSearchProps('slot'),
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',

      ...getColumnSearchProps('doctorName'),
      sorter: (a, b) => a.doctorName.length - b.doctorName.length,
      sortDirections: ['descend', 'ascend'],
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Patient',
      dataIndex: 'userName',
      key: 'userName',

      ...getColumnSearchProps('userName'),
      sorter: (a, b) => a.userName.length - b.userName.length,
      sortDirections: ['descend', 'ascend'],
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Booked At',
      dataIndex: 'bookedOn',
      key: 'bookedOn',

      ...getColumnSearchProps('bookedOn'),
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Problem',
      dataIndex: 'problem',
      key: 'problem',

      ...getColumnSearchProps('problem'),
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      showOnResponse: true,
      showOnDesktop: true,

      filters: [
        {
          text: 'Pending',
          value: 'pending',
        },
        {
          text: 'Approved',
          value: 'approved',
        },
        {
          text: 'Cancelled',
          value: 'cancelled',
        },
      ],

      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        return text.toUpperCase();
      },
    },
    (user.role === 'doctor' || user.role === 'admin') && {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',

      showOnResponse: true,
      showOnDesktop: true,

      render: (text, record) => {
        return (
          <div className='flex gap-1'>
            {record?.status === 'pending' && (
              <>
                <span
                  className='underline cursor-pointer action'
                  onClick={() => onUpdate(record.id, 'cancelled')}
                >
                  Cancel
                </span>
                <span
                  className='underline cursor-pointer action'
                  onClick={() => onUpdate(record.id, 'approved')}
                >
                  Approve
                </span>
              </>
            )}
            {record?.status === 'approved' && (
              <span
                className='underline cursor-pointer action'
                onClick={() => onUpdate(record.id, 'cancelled')}
              >
                Cancel
              </span>
            )}
            {record?.status === 'cancelled' && (
              <span
                className='underline cursor-pointer action'
                onClick={() => onUpdate(record.id, 'approved')}
              >
                Approve
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        antTableProps={{
          showHeader: true,
          columns,
          dataSource,
          bordered: true,

          pagination: {
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          },
        }}
        mobileBreakPoint={1060}
      />
    </div>
  );
}

export default Appointments;
