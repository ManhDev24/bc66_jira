import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATH } from './path'
import { Login } from '../modules/Auth/Login'
import { useAppSelector } from '../redux/hook'
import { AuthenLayout } from '../layout/AuthemLayout'
import { Register } from '../modules/Auth/Register'
import HomeLayout from '../layout/Home/HomeLayout'
import User from '../layout/Users/User'
import { ProfileUser } from '../layout/Profile'
import { AddProject } from '../modules/Project/AddProjects'
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
      path:'projects/new',
      element:<AddProject/>
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: PATH.USER,
          element: <User />,
        },
      ],
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: PATH.USER,
          element: <User />,
        },
      ],
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: PATH.PROFILE,
          element: <ProfileUser />,
        },
      ],
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: PATH.PROFILE,
          element: <ProfileUser />,
        },
      ],
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
