import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStoreUsers } from '../services/manageUserService';

const LIMIT = 20;

export function useManageUsers(search) {
  return useInfiniteQuery({
    queryKey: ['store-users', search],
    queryFn: ({ pageParam = 0 }) =>
      fetchStoreUsers({ search, offset: pageParam, limit: LIMIT }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;

      return lastPage.meta.hasNext
        ? lastPage.meta.offset + lastPage.meta.limit
        : undefined;
    },
    initialPageParam: 0,
  });
}
