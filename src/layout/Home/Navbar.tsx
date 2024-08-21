import React, { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PATH } from '../../routes/path'
import { Avatar, Button, Drawer, Flex, Menu, Spin, Switch, Typography } from 'antd'
import { useState } from 'react'
import { DownOutlined, SmileOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { Input, InputNumber, Slider } from 'antd'
import debounce from 'lodash/debounce'
import type { InputNumberProps } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { signOut } from '../../redux/slices/user_slice'
import { setLocalStorage } from '../../utils'
import logo from '../../../public/ico.png'
export interface DebounceSelectProps<ValueType = any> extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
}

// function DebounceSelect<
//   ValueType extends {
//     key?: string
//     label: React.ReactNode
//     value: string | number
//   } = any
// >({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
//   const [fetching, setFetching] = useState(false)
//   const [options, setOptions] = useState<ValueType[]>([])
//   const fetchRef = useRef(0)
//   const debounceFetcher = useMemo(() => {
//     const loadOptions = (value: string) => {
//       fetchRef.current += 1
//       const fetchId = fetchRef.current
//       setOptions([])
//       setFetching(true)

//       fetchOptions(value).then((newOptions) => {
//         if (fetchId !== fetchRef.current) {
//           // for fetch callback order
//           return
//         }

//         setOptions(newOptions)
//         setFetching(false)
//       })
//     }

//     return debounce(loadOptions, debounceTimeout)
//   }, [fetchOptions, debounceTimeout])

//   return <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" /> : null} {...props} options={options} />
// }

// Usage of DebounceSelect
interface UserValue {
  label: string
  value: string
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log('fetching user', username)

  return fetch('https://randomuser.me/api/?results=5')
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user: { name: { first: string; last: string }; login: { username: string } }) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    )
}
const Navbar: React.FC = () => {
  // FETCH LIST USER
  const [value, setValue] = useState<UserValue[]>([])
  // Drawer
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  // menu Projects
  const items: MenuProps['items'] = [
    {
      label: <Link to={PATH.PROJECT}>View all project</Link>,
      key: '0',
    },
    {
      label: <Link to={PATH.NEW}>Create project</Link>,
      key: '1',
    },
  ]
  // menu User
  const menuItems1 = (
    <Menu>
      <Menu.Item key="0">
        <Link to={PATH.USER}>View all users</Link>
      </Menu.Item>
    </Menu>
  )

  // select project drawer
  type LabelRender = SelectProps['labelRender']

  const options = [
    { label: 'gold', value: 'gold' },
    { label: 'lime', value: 'lime' },
    { label: 'green', value: 'green' },
    { label: 'cyan', value: 'cyan' },
  ]
  const labelRender: LabelRender = (props) => {
    const { label, value } = props

    if (label) {
      return value
    }
    return <span> value </span>
  }

  // Select Status
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  // Drawer select input number
  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value)
  }
  // drawer Slider
  const [disabled, setDisabled] = useState(false)
  const onChange1 = (checked: boolean) => {
    setDisabled(checked)
  }
  const user = useAppSelector((state) => state.user.currentUser)
  const dispatch = useAppDispatch()
  const handleSignOut = () => {
    dispatch(signOut())
    setLocalStorage('user', null)
  }
  const DropDownAvatar: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span style={{ cursor: 'auto' }} className=" font-bold text-md text-gray-500 uppercase pr-20 ">
          {user?.name}
        </span>
      ),
      disabled: true,
    },
    {
      key: '2',
      label: (
        <a className="no-underline " rel="noopener noreferrer" href={PATH.PROFILE}>
          <span className="text-gray-500 text-md">Profile</span>
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a
          onClick={() => {
            handleSignOut()
          }}
          className="no-underline "
          rel="noopener noreferrer"
          href=""
        >
          <span className="text-gray-500 text-md">Sign out</span>
        </a>
      ),
    },
  ]

  return (
    <div>
      <header className="h-14 bg-white shadow px-4 fixed left-0 top-0 w-full z-header" style={{ zIndex: '10' }}>
        <div className="h-full flex justify-between items-center">
          <nav className="h-full flex items-center">
            {/* link to projects icon */}
            <a className="text-blue-700 font-medium py-1 px-2 hover:bg-blue-200 focus:bg-blue-200 rounded mr-1" href={PATH.PROJECT}>
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
                className="h-6 block md:hidden"
                style={{ color: 'rgb(38, 132, 255)', fill: 'rgb(37, 56, 88)' }}
              >
                <defs>
                  <linearGradient x1="94.092%" x2="56.535%" y1="6.033%" y2="43.087%" id="uid2">
                    <stop stopColor="#0052CC" offset="18%" />
                    <stop stopColor="#2684FF" offset="100%" />
                  </linearGradient>
                </defs>
                <g stroke="none" strokeWidth={1} fillRule="nonzero">
                  <path
                    d="M26.0406546,5 L14.9983562,5 C14.9983562,6.32163748 15.5233746,7.58914413 16.4579134,8.52368295 C17.3924523,9.45822178 18.6599589,9.98324022 19.9815964,9.98324022 L22.0151159,9.98324022 L22.0151159,11.9465283 C22.0168782,14.6974491 24.2474348,16.9265768 26.9983562,16.9265762 L26.9983562,5.95770152 C26.9983562,5.42877757 26.5695786,5 26.0406546,5 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20.0420436,11 L9,11 C9.00176139,13.7504065 11.2309666,15.9796117 13.9813731,15.9813731 L16.0154337,15.9813731 L16.0154337,17.9451836 C16.0154337,19.2671728 16.5405919,20.5350167 17.4753794,21.4698042 C18.4101669,22.4045917 19.6780108,22.9297499 21,22.9297499 L21,11.9579564 C21,11.4288917 20.5711083,11 20.0420436,11 Z"
                    fill="url(#uid2)"
                  />
                  <path
                    d="M14.0420436,17 L3,17 C3.00176275,19.7516528 5.23291286,21.9813736 7.98456626,21.9813731 L10.0250133,21.9813731 L10.0250133,23.9451836 C10.0250082,26.6943468 12.2508419,28.9244664 15,28.9297499 L15,17.9579564 C15,17.4288917 14.5711083,17 14.0420436,17 Z"
                    fill="url(#uid2)"
                  />
                </g>
              </svg>
              <img src={logo} className="ml-5" width={25} alt="..." />
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
                className="h-6 block md:hidden"
                style={{ color: 'rgb(38, 132, 255)', fill: 'rgb(37, 56, 88)' }}
              >
                <defs>
                  <linearGradient x1="94.092%" x2="56.535%" y1="6.033%" y2="43.087%" id="uid2">
                    <stop stopColor="#0052CC" offset="18%" />
                    <stop stopColor="#2684FF" offset="100%" />
                  </linearGradient>
                </defs>
                <g stroke="none" strokeWidth={1} fillRule="nonzero">
                  <path
                    d="M26.0406546,5 L14.9983562,5 C14.9983562,6.32163748 15.5233746,7.58914413 16.4579134,8.52368295 C17.3924523,9.45822178 18.6599589,9.98324022 19.9815964,9.98324022 L22.0151159,9.98324022 L22.0151159,11.9465283 C22.0168782,14.6974491 24.2474348,16.9265768 26.9983562,16.9265762 L26.9983562,5.95770152 C26.9983562,5.42877757 26.5695786,5 26.0406546,5 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20.0420436,11 L9,11 C9.00176139,13.7504065 11.2309666,15.9796117 13.9813731,15.9813731 L16.0154337,15.9813731 L16.0154337,17.9451836 C16.0154337,19.2671728 16.5405919,20.5350167 17.4753794,21.4698042 C18.4101669,22.4045917 19.6780108,22.9297499 21,22.9297499 L21,11.9579564 C21,11.4288917 20.5711083,11 20.0420436,11 Z"
                    fill="url(#uid2)"
                  />
                  <path
                    d="M14.0420436,17 L3,17 C3.00176275,19.7516528 5.23291286,21.9813736 7.98456626,21.9813731 L10.0250133,21.9813731 L10.0250133,23.9451836 C10.0250082,26.6943468 12.2508419,28.9244664 15,28.9297499 L15,17.9579564 C15,17.4288917 14.5711083,17 14.0420436,17 Z"
                    fill="url(#uid2)"
                  />
                </g>
              </svg>
              <svg
                viewBox="0 0 69 32"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
                className="h-6 hidden md:block"
                style={{ color: 'rgb(38, 132, 255)', fill: 'rgb(37, 56, 88)' }}
              >
                <defs>
                  <linearGradient x1="98.0308675%" y1="0.160599572%" x2="58.8877062%" y2="40.7655246%" id="uid1">
                    <stop stopColor="#0052CC" offset="18%" />
                    <stop stopColor="#2684FF" offset="100%" />
                  </linearGradient>
                </defs>
                <g stroke="none" strokeWidth={1} fillRule="nonzero">
                  <path
                    d="M22.9366667,4 L11.41,4 C11.41,5.3800098 11.9582068,6.703498 12.934021,7.67931228 C13.9098353,8.65512657 15.2333235,9.20333333 16.6133333,9.20333333 L18.7366667,9.20333333 L18.7366667,11.2533333 C18.7385054,14.1244521 21.0655479,16.4514946 23.9366667,16.4533333 L23.9366667,5 C23.9366667,4.44771525 23.4889514,4 22.9366667,4 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.2333333,9.74333333 L5.70666667,9.74333333 C5.70850536,12.6144521 8.03554792,14.9414946 10.9066667,14.9433333 L13.03,14.9433333 L13.03,17 C13.0336786,19.8711178 15.3622132,22.196669 18.2333333,22.1966667 L18.2333333,10.7433333 C18.2333333,10.1910486 17.7856181,9.74333333 17.2333333,9.74333333 Z"
                    fill="url(#uid1)"
                  />
                  <path
                    d="M11.5266667,15.4833333 L0,15.4833333 C3.51929402e-16,18.357055 2.32961169,20.6866667 5.20333333,20.6866667 L7.33333333,20.6866667 L7.33333333,22.7366667 C7.33516565,25.6051863 9.65815176,27.9311544 12.5266667,27.9366667 L12.5266667,16.4833333 C12.5266667,15.9310486 12.0789514,15.4833333 11.5266667,15.4833333 Z"
                    fill="url(#uid1)"
                  />
                  <path
                    d="M37.07,18.956 C37.07,20.646 36.394,21.842 34.418,21.842 C33.56,21.842 32.702,21.686 32,21.4 L32,23.662 C32.65,23.896 33.586,24.104 34.808,24.104 C38.032,24.104 39.41,21.946 39.41,18.8 L39.41,6.918 L37.07,6.918 L37.07,18.956 Z M42.894,7.568 C42.894,8.556 43.544,9.128 44.454,9.128 C45.364,9.128 46.014,8.556 46.014,7.568 C46.014,6.58 45.364,6.008 44.454,6.008 C43.544,6.008 42.894,6.58 42.894,7.568 Z M43.31,24 L45.546,24 L45.546,11 L43.31,11 L43.31,24 Z M48.926,24 L51.11,24 L51.11,16.33 C51.11,13.574 52.852,12.716 55.712,13.002 L55.712,10.818 C53.164,10.662 51.864,11.754 51.11,13.288 L51.11,11 L48.926,11 L48.926,24 Z M66.45,24 L66.45,21.66 C65.618,23.376 64.058,24.26 62.056,24.26 C58.598,24.26 56.856,21.322 56.856,17.5 C56.856,13.834 58.676,10.74 62.316,10.74 C64.214,10.74 65.67,11.598 66.45,13.288 L66.45,11 L68.686,11 L68.686,24 L66.45,24 Z M59.092,17.5 C59.092,20.62 60.34,22.18 62.654,22.18 C64.656,22.18 66.45,20.906 66.45,18.02 L66.45,16.98 C66.45,14.094 64.812,12.82 62.914,12.82 C60.392,12.82 59.092,14.484 59.092,17.5 Z"
                    fillRule="evenodd"
                    fill="inherit"
                  />
                </g>
              </svg>
            </a>
            {/* btn link to projects */}
            <Dropdown className="ant-dropdown-trigger text-blue-700 h-8 font-medium py-1.5 hover:bg-blue-200 focus:bg-blue-200 rounded px-3" menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Projects
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            {/* btn link to users */}
            <Dropdown className="ant-dropdown-trigger text-blue-700 h-8 font-medium py-1.5 hover:bg-blue-200 focus:bg-blue-200 rounded px-3" overlay={menuItems1} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  User
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            {/* create task */}
            <div>
              <Button type="primary" className="px-3" onClick={showDrawer}>
                Create Task
              </Button>
            </div>
            {/* create avatar */}

            <Drawer title="Create Task" onClose={onClose} open={open}>
              <form className="container">
                <div className="w-full">
                  <p className="mb-0">Project </p>
                  <Select className="my-1" labelRender={labelRender} defaultValue="1" style={{ width: '100%' }} options={options} />
                  <span className="italic font-medium text-sm mt-2 ">* You can only create tasks of your own projects!</span>
                </div>
                <div className="mt-3">
                  <p className="mb-0">Task name</p>
                  <Input placeholder="Task Name" />
                </div>
                <div className="w-full mt-3">
                  <p>Status </p>
                  <Space wrap className="d-block_choose">
                    <Select
                      defaultValue="lucy"
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Lucy' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                      ]}
                    />
                  </Space>
                </div>
                <div className="w-full flex justify-between ">
                  <div className="w-5/12 mt-3 ">
                    <p>Priority </p>
                    <Space wrap name="priorityId" style={{ width: '100%' }} className="d-block_choose">
                      <Select
                        defaultValue="lucy"
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        options={[
                          { value: 'jack', label: 'Jack' },
                          { value: 'lucy', label: 'Lucy' },
                          { value: 'Yiminghe', label: 'yiminghe' },
                          {
                            value: 'disabled',
                            label: 'Disabled',
                            disabled: true,
                          },
                        ]}
                      />
                    </Space>
                  </div>
                  <div className="w-5/12 mt-3 ">
                    <p>Task Type</p>
                    <Space wrap name="typeId" style={{ width: '100%' }} className="d-block_choose">
                      <Select
                        defaultValue="lucy"
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        options={[
                          { value: 'jack', label: 'Jack' },
                          { value: 'lucy', label: 'Lucy' },
                          { value: 'Yiminghe', label: 'yiminghe' },
                          {
                            value: 'disabled',
                            label: 'Disabled',
                            disabled: true,
                          },
                        ]}
                      />
                    </Space>
                  </div>
                </div>
                {/* fetch list user */}
                <div className="w-full mt-3">
                  <p>Assigners</p>
                  <DebounceSelect
                    mode="multiple"
                    value={value}
                    name="listUserAsign"
                    placeholder="Select users"
                    fetchOptions={fetchUserList}
                    onChange={(newValue) => {
                      setValue(newValue as UserValue[])
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="w-full mt-3">
                  <p>Time Tracking</p>
                  <div className="w-full flex justify-between ">
                    <div className="w-5/12 mt-3 ">
                      <p>Hours spent </p>
                      <InputNumber style={{ width: '100%' }} name="originalEstimate" min={1} max={10} defaultValue={3} onChange={onChange} />
                    </div>
                    <div className="w-5/12 mt-3 ">
                      <p>Hours spent </p>
                      <InputNumber style={{ width: '100%' }} name="timeTrackingSpent" min={1} max={10} defaultValue={3} onChange={onChange} />
                    </div>
                  </div>
                  <div className="w-full">
                    <Slider defaultValue={30} disabled={disabled} />
                    Disabled: <Switch size="small" checked={disabled} onChange={onChange1} />
                  </div>
                </div>
                <div>
                  <p className="mt-3">Description</p>
                  <div className="relative">
                    <Editor
                      apiKey="vrdoer2sv642y76nwqxuds28hfp3zk5z00ohhlsi2t520aku"
                      init={{
                        plugins:
                          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                        toolbar:
                          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                          { value: 'First.Name', title: 'First Name' },
                          { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                      }}
                      initialValue="Welcome to TinyMCE!"
                    />
                  </div>
                </div>
              </form>
              <div className="my-4">
                <Flex gap="small" wrap>
                  <Button type="primary">Submit</Button>
                  <Button type="dashed">Cancel</Button>
                </Flex>
              </div>
            </Drawer>
          </nav>
          <div>
            <Dropdown menu={{ items: DropDownAvatar }} placement="bottomLeft" trigger={['click']}>
              <Avatar src={user?.avatar} className="hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer" />
            </Dropdown>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar
