import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATH } from './path'
import { Login } from '../modules/Auth/Login'
import { useAppSelector } from '../redux/hook'
import { AuthenLayout } from '../layout/AuthemLayout'
import { Register } from '../modules/Auth/Register'
import HomePage from '../modules/Home/HomePage'
import HomeLayout from '../layout/Home/HomeLayout'
const RejectedRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.user)
  if (currentUser !== null) {
    return <Navigate to={PATH.HOME} />
  }
  return <Outlet />
}

const ProtectedRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.user)
  if (currentUser === null) {
    return <Navigate to={PATH.LOGIN} />
  }
  return <Outlet />
}

const useRoutesElement = () => {
  const routes = useRoutes([
    {
      path: '*',
      element: <ProtectedRoutes />,
      
    },
    {
      path: '',
      element: <ProtectedRoutes />,
      
    },
    {
      path: '*',
      element: <RejectedRoutes />,
      
    },
    {
      path: '',
      element: <RejectedRoutes />,
      
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: PATH.HOME,
          element: <HomeLayout />,
        },
      ],
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: PATH.HOME,
          element: <HomeLayout />,
        },
      ],
    },
    {
      path: 'auth',
      element: <RejectedRoutes />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <AuthenLayout>
              <Login />
            </AuthenLayout>
          ),
        },
        {
          path: PATH.REGISTER,
          element: (
            <AuthenLayout>
              <Register />
            </AuthenLayout>
          ),
        },
      ],
    },
  ])
  return routes
}

export default useRoutesElement
