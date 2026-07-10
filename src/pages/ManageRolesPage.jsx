import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import ManageRolesHeader from '../components/Settings/ManageRoles/ManageRolesHeader';
import ManageRolesTable from '../components/Settings/ManageRoles/ManageRolesTable';
import AddNewRoleModal from '../components/Settings/ManageRoles/AddNewRole';
import { fetchRoles } from '../services/manageRolesService';

const LIMIT = 20;

export default function ManageRolesPage() {
  const [searchRoles, setSearchRoles] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['store-roles', searchRoles],
    queryFn: async ({ pageParam = 0 }) => {
      await new Promise((r) => setTimeout(r, 300));
      return fetchRoles({
        search: searchRoles,
        offset: pageParam,
        limit: LIMIT,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext
        ? lastPage.meta.offset + lastPage.meta.limit
        : undefined,
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 0,
  });

  const roles = data?.pages.flatMap((page) => page.Data) ?? [];

  return (
    <div className='flex flex-col flex-1'>
      <ManageRolesHeader
        onAddClick={() => setShowAddRole(true)}
        onSearch={setSearchRoles}
      />

      <ManageRolesTable
        roles={roles}
        isLoading={isLoading}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNext={fetchNextPage}
        hasNextPage={hasNextPage}
      />

      <AddNewRoleModal
        open={showAddRole}
        onClose={() => setShowAddRole(false)}
      />
    </div>
  );
}
