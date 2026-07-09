import { useState } from 'react';

import { useManageUsers } from '../hooks/useManageUsers';
import ManageUserHeader from '../components/Settings/ManageUser/ManageUserHeader';
import AddNewUserModal from '../components/Settings/ManageUser/AddNewUser';
import ManageUserTable from '../components/Settings/ManageUser/ManageUserTable';

export default function ManageUser() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useManageUsers(searchTerm);

  const users = data?.pages.flatMap((page) => page.users ?? []) ?? [];

  return (
    <div className='flex flex-col flex-1'>
      <ManageUserHeader
        onAddClick={() => setShowAddUser(true)}
        onSearch={setSearchTerm}
      />
      <AddNewUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
      />
      <ManageUserTable
        users={users}
        isLoading={isLoading}
        isFetching={isFetching}
        onFetchNext={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
