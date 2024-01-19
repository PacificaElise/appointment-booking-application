import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Button, Input, Space, message, Modal, Table } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { deleteUser, getUsers, updateUser } from '../../requests/users';
import { deleteDoctor } from '../../requests/doctors';

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
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  const updateUserDatabase = async (payload) => {
    dispatch(ShowLoader(true));
    try {
      const res = await updateUser(payload);
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',

      ...getColumnSearchProps('name'),
      sorter: (a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',

      filters: [
        {
          text: 'Doctor',
          value: 'doctor',
        },
        {
          text: 'User',
          value: 'user',
        },
        {
          text: 'Admin',
          value: 'admin',
        },
      ],

      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) =>
        a.role.localeCompare(b.role, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        return text.toUpperCase();
      },
    },
    {
      title: 'Ac-tions',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 50,

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

  const dataSource = users;

  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const Delete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete the doctor?',
      okType: 'danger',
      okText: 'Yes',

      onOk: () => {
        deleteDoctorFromDatabase(record?.id);
        deleteUserFromDatabase(record?.id);
        setUsers((pre) => {
          return pre.filter((doctor) => doctor.id !== record?.id);
        });
      },
    });
  };

  const Edit = (record) => {
    setIsEdit(true);
    setEditingUser({ ...record });
  };

  const resetEditing = () => {
    setIsEdit(false);
    setEditingUser(null);
  };

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
          setUsers((pre) => {
            return pre.map((user) => {
              if (user.id === editingUser?.id) {
                updateUserDatabase(editingUser);
                return editingUser;
              } else return user;
            });
          });
          resetEditing();
        }}
      >
        <Input
          value={editingUser?.name}
          onChange={(e) => {
            setEditingUser((pre) => {
              return { ...pre, name: e.target.value };
            });
          }}
        ></Input>
        <Input
          value={editingUser?.email}
          onChange={(e) => {
            setEditingUser((pre) => {
              return { ...pre, email: e.target.value };
            });
          }}
        ></Input>
      </Modal>
    </div>
  );
}

export default UsersList;
