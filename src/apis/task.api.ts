import fetcher from './fetcher'

export const taskApi = {
  getAllStatus: async () => {
    try {
      const response = await fetcher.get('/Status/getAll')
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  getPriority: async (id: string = '0') => {
    try {
      const respone = await fetcher.get(`/Priority/getAll?id=${id}`)
      return respone.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  getTaskType: async () => {
    try {
      const response = await fetcher.get('/TaskType/getAll')
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  getUserByProjectId: async (id: string) => {
    try {
      const response = await fetcher.get(`/Users/getUserByProjectId?idProject=${id}`)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
  createTask: async (payload: any) => {
    try {
      const response = await fetcher.post('/Project/createTask', payload)
      return response.data.content
    } catch (error: any) {
      throw Error(error.response.data.message)
    }
  },
}
