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
  if (currentUser) {
    return <Navigate to={PATH.HOME} replace />
  }
  return <Outlet />
}

const ProtectedRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.user)
  if (!currentUser) {
    return <Navigate to={PATH.LOGIN} replace />
  }
  return <Outlet />
}

const useRoutesElement = () => {
  const routes = useRoutes([
    // Routes for authenticated users
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        { path: PATH.HOME, element: <HomeLayout /> },
        { path: PATH.USER, element: <User /> },
        { path: PATH.PROFILE, element: <ProfileUser /> },
        { path: 'projects/new', element: <AddProject /> },
        { path: PATH.EDIT, element: <EditProject /> },
        { path: PATH.TASK, element: <TaskBoard /> },
        // Any other protected routes can be added here
      ],
    },
    // Routes for non-authenticated users
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
    // Fallback for unknown routes
    { path: '*', element: <Navigate to={PATH.HOME} replace /> },
  ])

  return routes
}

export default useRoutesElement
