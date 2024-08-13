// hooks/index.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store'
import { removeLocalStorage } from '../utils'
import { PATH } from '../routes/path'
import { signOut } from './slices/user_slice'
import { useNavigate } from 'react-router-dom'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useSignOut = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signOutUser = () => {
    removeLocalStorage('user')
    dispatch(signOut())
    navigate(PATH.LOGIN)
  }

  return { signOutUser }
}
