import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { DataListProject, Project } from '../interface/projectListInter'
import { projectApi } from '../apis/projects.api'

type useListProjectOption = Omit<UseQueryOptions<Project>, 'queryKey' | 'queryFn'>
export const useListProjectName = (currentPage: number, options?: useListProjectOption) => {
    const queryResult1 = useQuery({
      queryKey: ['list-project', { currentPage }],
      queryFn: () =>
        projectApi.getAllProjectList<Project>({ page: currentPage }),
        ...options,
    });
    
    return queryResult1;
};