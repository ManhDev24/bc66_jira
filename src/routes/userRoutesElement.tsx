import { Navigate, useRoutes } from "react-router-dom"
import { PATH } from './path'
import HomeLayout from "../layout/Home/HomeLayout"

const useRoutesElement = ()=>{
    const routes = useRoutes([
        {
            path: '*',
            element: <Navigate to={PATH.HOME} />,
        },
        {
            path: '/',
            element: <HomeLayout />,
        },
        {
            path: '/projects',
            element: <HomeLayout />,
        },
    ])
    return routes
}
export default useRoutesElement