import { useAppSelector } from '../../Redux/hook'

const HomePage = () => {
  const user = useAppSelector((state) => state.user)
  return <div className="flex justify-center items-center">Hi {user.currentUser?.name}</div>
}

export default HomePage
