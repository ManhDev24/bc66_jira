import { Button, Col, Input, Modal, Row, Space, Spin, Table, TableProps, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import Navbar from '../Home/Navbar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '../../apis/user.api'
import { SearchOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/es/table'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'
interface DataType {
  key: string
  no: number
  name: string
  email: string
  phoneNumber: string
  userId: string
  avatar: string
}

interface FormValues {
  userId: string
  password: string
  confirmPass: string
  email: string
  name: string
  phoneNumber: string
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPass: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  name: yup.string().required('Name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
})

const getColumnSearchProps = (dataIndex: keyof DataType): ColumnType<DataType> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] as string}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm({ closeDropdown: true })}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button onClick={() => confirm({ closeDropdown: true })} type="primary" style={{ width: 90 }}>
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters?.()
            confirm({ closeDropdown: true })
          }}
          type="default"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex]
      ?.toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
})

const User = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const isWebDevice = useMediaQuery('(max-width:832px)')

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      userId: '',
      email: '',
      password: '',
      confirmPass: '',
      name: '',
      phoneNumber: '',
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    mode: 'onBlur',
  })

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 3000)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const {
    data: UserList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['list-user'],
    queryFn: userAPI.getListUser,
  })

  const dataSource = UserList?.map((user: any, index: number) => ({
    key: user.userId,
    no: index + 1,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    userId: user.userId,
    avatar: user.avatar,
  }))

  const pagination = {
    pageSize: 10,
    showSizeChanger: false,
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'No',
      key: 'no',
      dataIndex: 'no',
      width: 50,
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'User ID',
      key: 'userId',
      dataIndex: 'userId',
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      responsive: ['xs', 'sm', 'md'],
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Phone Number',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      responsive: ['xs', 'sm', 'md'],
      render: (phoneNumber: string) => <div style={{ width: '80px' }}>{phoneNumber}</div>,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Avatar',
      key: 'avatar',
      dataIndex: 'avatar',
      responsive: ['xs', 'sm', 'md'],
      render: (avatar: string) => <img src={avatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      responsive: ['xs', 'sm', 'md'],
      render: (_, record: DataType) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.userId)} type="link">
            Edit
          </Button>
          <Popconfirm title="Are you sure you want to remove user?" onConfirm={() => handleDelete(record.userId)} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const {
    data: userData,
    isLoading: isGetUserInfo,
    isError: isGetUserError,
  } = useQuery({
    queryKey: ['detail-user', selectedUserId],
    queryFn: () => (selectedUserId ? userAPI.getDetailuserById(selectedUserId) : Promise.resolve(null)),
    enabled: !!selectedUserId,
  })

  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0]
      setValue('userId', user.userId || '')
      setValue('name', user.name || '')
      setValue('email', user.email || '')
      setValue('phoneNumber', user.phoneNumber || '')
    } else {
      reset()
    }
  }, [userData, setValue, reset])

  const { mutate: handleEditUser, isLoading: isEditing } = useMutation({
    mutationFn: (payload: FormValues) => userAPI.editUser(payload),
    onSuccess: () => {
      toast.success('Edit successful!!')
      handleCancel()
      queryClient.refetchQueries({
        queryKey: ['list-user'],
        type: 'active',
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'An unexpected error occurred'
      toast.error(errorMessage)
    },
  })

  const { mutate: handleDeleteUser, isLoading: isDeleting } = useMutation({
    mutationFn: (id: string) => userAPI.deleteUser(id),
    onSuccess: () => {
      toast.success('Delete successful!!')
      queryClient.refetchQueries({
        queryKey: ['list-user'],
        type: 'active',
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'An unexpected error occurred'
      toast.error(errorMessage)
    },
  })
  const onSubmit = (data: FormValues) => {
    const { confirmPass, userId, ...rest } = data
    const formData = { id: userId, ...rest }
    handleEditUser(formData as any)
  }

  if (isLoading || isGetUserInfo) {
    return <Spin className="mx-auto w-full h-screen flex justify-center items-center" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  }

  if (isError || isGetUserError) {
    return <div>Error loading data</div>
  }

  const handleEdit = (id: string) => {
    setSelectedUserId(id)
    showModal()
  }

  const handleDelete = (id: string) => {
    handleDeleteUser(id)
  }
  const deviceColumns = [
    {
      title: 'User detail',
      render: (record: DataType) => {
        const userDataName = record.name
        const userDataEmail = record.email
        const userDataPhone = record.phoneNumber
        const userDataAvatar = record.avatar
        const userId = record.userId

        return (
          <div>
            <ul className="text-text-decoration-none list-unstyled">
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>UserId:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <a className="no-underline">{userId}</a>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Name:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <a className="no-underline text-text-decoration-none text-black">{userDataName}</a>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>PhoneNumber:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <a className="text-black no-underline">{userDataPhone}</a>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Email:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <a className="text-black no-underline">{userDataEmail}</a>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Avatar:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <img src={userDataAvatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Action:</strong>
                  </p>
                </div>
                <div className="col-6">
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(record.userId)} type="link">
                    Edit
                  </Button>
                  <Popconfirm title="Are you sure you want to remove user?" onConfirm={() => handleDelete(record.userId)} okText="Yes" cancelText="No">
                    <Button icon={<DeleteOutlined />} type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </li>
            </ul>
          </div>
        )
      },
    },
  ]

  return (
    <div className=" responsive-container mx-auto p-4 mt-5 flex justify-center h-screen">
      <Navbar />
      <div className="container py-6">
        <Table className="table" size="middle" rowKey={({ key }) => key} columns={isWebDevice ? deviceColumns : columns} dataSource={dataSource} pagination={pagination} loading={isLoading} />
      </div>
      <Modal
        open={open}
        title="Edit User"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[48, 10]}>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">ID</h6>
              </label>
              <Controller name="userId" control={control} render={({ field }) => <Input {...field} readOnly size="large" className="mt-1" status={errors.userId ? 'error' : ''} />} />
              {errors.userId && <span className="text-red-600">{errors.userId.message}</span>}
            </Col>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">Name</h6>
              </label>
              <Controller name="name" control={control} render={({ field }) => <Input {...field} size="large" className="mt-1" status={errors.name ? 'error' : ''} />} />
              {errors.name && <span className="text-red-600">{errors.name.message}</span>}
            </Col>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">Email</h6>
              </label>
              <Controller name="email" control={control} render={({ field }) => <Input {...field} size="large" className="mt-1" status={errors.email ? 'error' : ''} />} />
              {errors.email && <span className="text-red-600">{errors.email.message}</span>}
            </Col>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">Phone Number</h6>
              </label>
              <Controller name="phoneNumber" control={control} render={({ field }) => <Input {...field} size="large" className="mt-1" status={errors.phoneNumber ? 'error' : ''} />} />
              {errors.phoneNumber && <span className="text-red-600">{errors.phoneNumber.message}</span>}
            </Col>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">Password</h6>
              </label>
              <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} size="large" className="mt-1" status={errors.password ? 'error' : ''} />} />
              {errors.password && <span className="text-red-600">{errors.password.message}</span>}
            </Col>
            <Col span={24}>
              <label className="text-sm pt-2">
                <span className="text-red-600 ">* </span>
                <h6 className="bold inline-block">Confirm Password</h6>
              </label>
              <Controller name="confirmPass" control={control} render={({ field }) => <Input.Password {...field} size="large" className="mt-1" status={errors.confirmPass ? 'error' : ''} />} />
              {errors.confirmPass && <span className="text-red-600">{errors.confirmPass.message}</span>}
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  )
}

export default User
