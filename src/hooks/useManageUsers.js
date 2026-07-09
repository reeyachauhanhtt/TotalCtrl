import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStoreUsers } from '../services/manageUserService';

const LIMIT = 20;

export function useManageUsers(search) {
  return useInfiniteQuery({
    queryKey: ['store-users', search],
    queryFn: async ({ pageParam = 0 }) => {
      await new Promise((r) => setTimeout(r, 300));
      return fetchStoreUsers({ search, offset: pageParam, limit: LIMIT });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      return lastPage.meta.hasNext
        ? lastPage.meta.offset + lastPage.meta.limit
        : undefined;
    },
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
    select: (data) => {
      const seen = new Set();
      const users = data.pages
        .flatMap((page) => page.users)
        .filter((u) => {
          if (seen.has(u.id)) return false;
          seen.add(u.id);
          return true;
        });
      return { ...data, users };
    },
  });
}
