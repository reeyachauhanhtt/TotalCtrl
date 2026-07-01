import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchTransferItemInventories } from '../../../services/transfersTabService';
import ShowAllDropdown from './ShowAllDropdown';
import AllInventoriesDropdown from './AllInventoriesDropdown';

export default function TransferInformation({
  inventoryId,
  dateRange,
  showAllValue,
  onShowAllChange,
  inventoryValue,
  onInventoryChange,
  openDropdown,
  onToggleDropdown,
}) {
  const enabled = !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate;

  const { data: invData } = useQuery({
    queryKey: [
      'transferItemInventories',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchTransferItemInventories({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled,
    staleTime: 0,
  });
  const inventories = invData?.Data?.Data ?? [];

  return (
    <div
      className='flex justify-between items-center w-full'
      style={{ padding: '38px 0', margin: 0 }}
    >
      {/* Left: title */}
      <div>
        <span
          style={{
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            color: '#19191c',
          }}
        >
          Transfer information
        </span>
      </div>

      {/* Right: dropdowns */}
      <div className='flex items-center'>
        <ShowAllDropdown
          value={showAllValue}
          onChange={onShowAllChange}
          isOpen={openDropdown === 'showAll'}
          onToggle={() => onToggleDropdown('showAll')}
        />

        <AllInventoriesDropdown
          inventories={inventories}
          value={inventoryValue}
          onChange={onInventoryChange}
          isOpen={openDropdown === 'inventory'}
          onToggle={() => onToggleDropdown('inventory')}
        />
      </div>
    </div>
  );
}
