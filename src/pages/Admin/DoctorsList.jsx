import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Button, Input, Space, message, Modal, Table } from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { deleteDoctor, getDoctors, updateDoctor } from '../../requests/doctors';
import { deleteUser } from '../../requests/users';

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
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
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
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  const deleteDoctorFromDatabase = async (id) => {
    dispatch(ShowLoader(true));
    try {
      const res = await deleteDoctor(id);
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

  const deleteUserFromDatabase = async (id) => {
    dispatch(ShowLoader(true));
    try {
      const res = await deleteUser(id);
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

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const dataSource = doctors || [];

  const [isEdit, setIsEdit] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const Delete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete the doctor?',
      okType: 'danger',
      okText: 'Yes',

      onOk: () => {
        deleteDoctorFromDatabase(record?.id);
        deleteUserFromDatabase(record?.id);
        setDoctors((pre) => {
          return pre.filter((doctor) => doctor.id !== record?.id);
        });
      },
    });
  };

  const Edit = (record) => {
    setIsEdit(true);
    setEditingDoctor({ ...record });
  };

  const resetEditing = () => {
    setIsEdit(false);
    setEditingDoctor(null);
  };

  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      ...getColumnSearchProps('firstName'),
      sorter: (a, b) =>
        a.firstName.localeCompare(b.firstName, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',

      ...getColumnSearchProps('lastName'),
      sorter: (a, b) =>
        a.lastName.localeCompare(b.lastName, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

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
      key: 'phone',

      ...getColumnSearchProps('phone'),
      sorter: (a, b) =>
        a.phone.localeCompare(b.phone, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Speciality',
      dataIndex: 'speciality',
      key: 'speciality',

      ...getColumnSearchProps('speciality'),
      sorter: (a, b) =>
        a.speciality.localeCompare(b.speciality, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

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
      sorter: (a, b) =>
        a.status.localeCompare(b.status, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        return text.toUpperCase();
      },
    },
    {
      title: 'Confir-mation',
      dataIndex: 'confirmation',
      key: 'confirmation',
      fixed: 'right',
      width: 50,

      render: (text, record) => (
        <div className='flex gap-1 wrap'>
          {(record?.status === 'pending' || record?.status === 'unblocked') && (
            <>
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
            </>
          )}
          {record?.status === 'rejected' && (
            <span
              className='underline cursor-pointer action'
              onClick={() => changeStatus({ ...record, status: 'approved' })}
            >
              Approve
            </span>
          )}
          {record?.status === 'approved' && (
            <span
              className='underline cursor-pointer action'
              onClick={() => changeStatus({ ...record, status: 'blocked' })}
            >
              Block
            </span>
          )}
          {record?.status === 'blocked' && (
            <span
              className='underline cursor-pointer action'
              onClick={() => changeStatus({ ...record, status: 'unblocked' })}
            >
              Unblock
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Ac-tions',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 50,

      showOnResponse: true,
      showOnDesktop: true,

      render: (text, record) => {
        return (
          <div className='flex gap-1'>
            <EditOutlined
              style={{ color: 'black' }}
              onClick={() => Edit(record)}
            />
            <DeleteOutlined
              style={{ color: 'red' }}
              onClick={() => Delete(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey={(record) => record.key}
        showHeader={true}
        columns={columns}
        dataSource={dataSource}
        bordered={true}
        scroll={{ x: true }}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        title="Edit doctor's information"
        okText='Save'
        open={isEdit}
        onCancel={() => resetEditing()}
        onOk={() => {
          setDoctors((pre) => {
            return pre.map((doctor) => {
              if (doctor.id === editingDoctor?.id) {
                changeStatus(editingDoctor);
                return editingDoctor;
              } else return doctor;
            });
          });
          resetEditing();
        }}
      >
        <Input
          value={editingDoctor?.firstName}
          onChange={(e) => {
            setEditingDoctor((pre) => {
              return { ...pre, firstName: e.target.value };
            });
          }}
        ></Input>
        <Input
          value={editingDoctor?.lastName}
          onChange={(e) => {
            setEditingDoctor((pre) => {
              return { ...pre, lastName: e.target.value };
            });
          }}
        ></Input>
        <Input
          value={editingDoctor?.email}
          onChange={(e) => {
            setEditingDoctor((pre) => {
              return { ...pre, email: e.target.value };
            });
          }}
        ></Input>
        <Input
          value={editingDoctor?.phone}
          onChange={(e) => {
            setEditingDoctor((pre) => {
              return { ...pre, phone: e.target.value };
            });
          }}
        ></Input>
        <Input
          value={editingDoctor?.speciality}
          onChange={(e) => {
            setEditingDoctor((pre) => {
              return { ...pre, speciality: e.target.value };
            });
          }}
        ></Input>
      </Modal>
    </div>
  );
}

export default DoctorsList;
