import { Welcome } from '../interface'
import { CurrentUser, UserLoginRequest, UserRegisterRequest } from '../interface/user.interface'
import fetcher from './fetcher'

export const userAPI = {
  login: async (data: UserLoginRequest) => {
    try {
      const response = await fetcher.post<Welcome<CurrentUser>>('/Users/signin', data)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  register: async (data: UserRegisterRequest) => {
    try {
      const response = await fetcher.post('/Users/signup', data)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
}
