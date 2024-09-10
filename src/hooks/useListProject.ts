import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { DataListProject, Project } from '../interface/projectListInter'
import { projectApi } from '../apis/projects.api'

type useListProjectOption = Omit<UseQueryOptions<DataListProject>, 'queryKey' | 'queryFn'>


export const useListProject = (currentPage: number, options?: useListProjectOption) => {
  const queryResult = useQuery({
    queryKey: ['list-project', { currentPage }],
    queryFn: () =>
      projectApi.getAllProject<DataListProject>({ page: currentPage }),
      ...options,
  });
  
  return queryResult;
};



