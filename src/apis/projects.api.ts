import {  PAGE_SIZE } from '../constant'
import { BREARER, TOKEN_CYBERSOFT } from '../constant/urlConfig';
import { Welcome } from '../interface'
import { Project, ProjectData } from '../interface/projectListInter';
import { DataListProject,Pr } from './../interface/projectListInter'
import fetcher from './fetcher'

export const projectApi = {
    getAllProject: async <T>(payload: { page: number; pageSize?: number }) => {
        const params = {
            soTrang: payload.page,
            soPhanTuTrenTrang: payload.pageSize || PAGE_SIZE,
        }  
      try {
        const response = await fetcher.get<Welcome<DataListProject>>('/Project/getAllProject', {
            params,
        })
        return response.data.content
      } catch (error: any) {
        
        throw Error(error.response.data.content)
        
      }
    },
    addProject: async (payload: ProjectData) => {
      try {
        const response = await fetcher.post('https://jiranew.cybersoft.edu.vn/api/Project/createProject', payload)
        console.log(response.data.content);
        return response.data.content
      } catch (error: any) {
        console.log(error);
        throw Error(error.response.data.content)
      }
    },
}