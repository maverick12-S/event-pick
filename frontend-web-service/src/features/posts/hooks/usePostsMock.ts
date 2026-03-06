import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { postsMockApi, type GetPostsParams } from '../../../api/mock/postsMockApi';

export const usePostsMock = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ['mock', 'posts', params.tab, params.page ?? 1, params.limit ?? 60, params.search ?? ''],
    queryFn: () => postsMockApi.getPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default usePostsMock;
