import { Button, Col, Input, Row, Typography, Form, Spin } from 'antd'
import { PATH } from '../../../routes/path'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { CurrentUser, UserLoginRequest } from '../../../interface/user.interface'
import { userAPI } from '../../../apis/user.api'
import { setLocalStorage } from '../../../util'
import { useAppDispatch } from '../../../Redux/hook'
import { setUser } from '../../../Redux/slices/user_slice'
import { toast } from 'react-toastify'
import { LoadingOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

interface FormValues {
  email: string
  password: string
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email is invalid')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is invalid')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = () => {
  const dispatch = useAppDispatch()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    mode: 'onBlur',
  })

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (payload: UserLoginRequest) => userAPI.login(payload),
    onSuccess: (currentUser) => {
      setLocalStorage<CurrentUser>('user', currentUser)
      dispatch(setUser(currentUser))
      toast.success('Login successfull')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'An unexpected error occurred'
      toast.error(errorMessage)
    },
  })

  const onSubmit = (value: FormValues) => {
    handleLogin(value)
  }
  if (isPending) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  }
  return (
    <div className="w-[400px]">
      <div className="my-4 text-center">
        <Typography className="font-bold text-3xl">Login</Typography>
      </div>
      <Form className="mt-4" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={[48, 10]}>
          <Col span={24}>
            <label className="text-xs text-[#6A7280]">*Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} type="text" size="large" className="mt-1" placeholder="Email is required ..." status={errors.email ? 'error' : ''} />}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </Col>

          <Col span={24}>
            <label className="text-xs text-[#6A7280]">*Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  type="password"
                  size="large"
                  className="mt-1"
                  placeholder="Password is required..."
                  status={errors.password ? 'error' : ''}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              )}
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </Col>

          <Col span={24} className="mt-2">
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Col>
        </Row>
      </Form>
      <Typography className="mt-8 text-center">
        Do no have account ?
        <a href={PATH.REGISTER}>
          <span className="text-blue-700 font-medium cursor-pointer"> Register</span>
        </a>
      </Typography>
    </div>
  )
}

export default Login
