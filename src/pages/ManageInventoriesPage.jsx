import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ManageInventoriesHeader from '../components/Settings/ManageInventories/ManageInventoriesHeader';
import ManageInventoryTable from '../components/Settings/ManageInventories/ManageInventoryTable';
import AddNewInventory from '../components/Settings/ManageInventories/AddNewInventory';
import {
  fetchInventoriesWithAccess,
  fetchInventoryAccessMap,
} from '../services/manageInventoriesService';

export default function ManageInventoriesPage() {
  const [showAddInventory, setShowAddInventory] = useState(false);

  const { data: inventories = [], isLoading } = useQuery({
    queryKey: ['inventories-with-access'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 3000));
      return fetchInventoriesWithAccess();
    },
  });
  const firstInventoryId = inventories[0]?.id;

  const inventoryIds = inventories.map((inv) => inv.id);

  const { data: permissionMap = {} } = useQuery({
    queryKey: ['inventory-permission-map'],
    queryFn: () => fetchInventoryAccessMap(inventoryIds),
    enabled: inventoryIds.length > 0,
    staleTime: Infinity,
  });

  // const allUsers = Object.values(
  //   inventories.reduce((acc, inv) => {
  //     inv.users?.forEach((u) => {
  //       if (!acc[u.id]) acc[u.id] = u;
  //     });
  //     return acc;
  //   }, {}),
  // );

  console.log(
    'inventories',
    inventories,
    'isLoading',
    isLoading,
    'firstInventoryId',
    firstInventoryId,
    'permissionMap',
    permissionMap,
  );

  return (
    <div className='flex flex-col flex-1'>
      <ManageInventoriesHeader onAddClick={() => setShowAddInventory(true)} />
      <ManageInventoryTable
        inventories={inventories}
        isLoading={isLoading}
        permissionMap={permissionMap}
        // allUsers={allUsers}
      />
      <AddNewInventory
        open={showAddInventory}
        onClose={() => setShowAddInventory(false)}
      />
    </div>
  );
}
