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
import { EditProject } from '../modules/Project/EditProjects'
import TaskBoard from '../modules/Task/TaskBoard'

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
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: '',
          element: <Navigate to={PATH.HOME} />,
        },
        {
          path: PATH.PROJECT,
          element: <HomeLayout />,
        },
        {
          path: PATH.NEW,
          element: <AddProject />,
        },
        {
          path: PATH.EDIT,
          element: <EditProject />,
        },
        {
          path: PATH.TASK,
          element: <TaskBoard />,
        },
        {
          path: PATH.USER,
          element: <User />,
        },
        {
          path: PATH.PROFILE,
          element: <ProfileUser />,
        },
      ],
    },
    {
      path: PATH.AUTH,
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
    {
      path: '*',
      element: <Navigate to={PATH.HOME} />,
    },
  ])
  return routes
}

export default useRoutesElement
