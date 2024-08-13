import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { DataListProject } from '../interface/projectListInter'
import { projectApi } from '../apis/projects.api'

type useListProjectOption = Omit<UseQueryOptions<DataListProject>, 'queryKey' | 'queryFn'>

export const useListProject = (currentPage: number,pageSize:number, options?: useListProjectOption) => {
  const queryResult = useQuery({
    queryKey: ['list-project', { currentPage, pageSize:pageSize}],
    queryFn: () =>
      projectApi.getAllProject<DataListProject>({ page: currentPage, pageSize:pageSize }),
      ...options,
  });
  
  return queryResult;
};
