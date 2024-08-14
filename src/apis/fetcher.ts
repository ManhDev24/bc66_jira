import axios from 'axios'
import { BASE_URL, BREARER, TOKEN_CYBERSOFT } from '../constant/urlConfig'
import { getLocalStorage } from '../utils'
import { CurrentUser } from '../interface/user.interface'

const fetcher = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
})

fetcher.interceptors.request.use((config: { headers: any }) => {
  const currentUser = getLocalStorage<CurrentUser>('user')
  config.headers = {
    ...config.headers,
    Authorization: currentUser ? `Bearer ${currentUser.accessToken}` : '',
  } as any
  return config
})

export default fetcher
