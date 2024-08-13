import {  PAGE_SIZE } from '../constant'
import { BREARER, TOKEN_CYBERSOFT } from '../constant/urlConfig';
import { ApiWelcome } from '../interface'
import { Project } from '../interface/projectListInter';
import { DataListProject } from './../interface/projectListInter'
import fetcher from './fetcher'

export const projectApi = {
    getAllProject: async <T>(payload: { page: number; pageSize?: number }) => {
        const params = {
            soTrang: payload.page,
            soPhanTuTrenTrang: payload.pageSize || PAGE_SIZE,
        }  
      try {
        const response = await fetcher.get<ApiWelcome<DataListProject>>('/Project/getAllProject', {
            params,
        })
        console.log(response.data.content)
        return response.data.content
      } catch (error: any) {
        throw Error(error.response.data.content)
      }
    },
}