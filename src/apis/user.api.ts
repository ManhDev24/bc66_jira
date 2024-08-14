import { Welcome } from '../interface'
import { CurrentUser, EditUser, UserLoginRequest, UserRegisterRequest } from '../interface/user.interface'
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
  getListUser: async () => {
    try {
      const response = await fetcher.get('/Users/getUser')
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  getDetailuserById: async (id: string) => {
    try {
      const response = await fetcher.get(`/Users/getUser?keyword=${id}`)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  editUser: async (payload: EditUser) => {
    try {
      const response = await fetcher.put('/Users/editUser', payload)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  deleteUser: async (id: string) => {
    try {
      const response = await fetcher.delete(`/Users/deleteUser?id=${id}`)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
}
