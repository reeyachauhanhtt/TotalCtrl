import { useState, useEffect } from 'react';

import InventoryDropdown from '../Common/InventoryDropDown';
import { SkeletonBar } from '../Common/Skeleton';

export default function AnalyticsHeader({
  inventories = [],
  selectedInventory,
  onSelectInventory,
}) {
  return (
    <div className='h-20 flex items-center justify-between px-10 border-b border-gray-200 bg-white'>
      <h1 className='text-[20px] font-semibold text-gray-900'>Analytics</h1>
      {inventories.length > 0 && (
        <InventoryDropdown
          inventories={inventories}
          selectedInventory={selectedInventory}
          onSelect={onSelectInventory}
          error={null}
        />
      )}
    </div>
  );
}
export function AnalyticsDetailHeader({
  inventoryName,
  inventories = [],
  selectedInventory,
  onSelectInventory,
  onBack,
  inventoryError,
  isInventoryLoading,
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className='h-18 flex items-center justify-between px-10 border-b border-gray-200 bg-white'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-1 text-[14px]'>
        <button
          onClick={onBack}
          className='text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none p-0'
        >
          Analytics
        </button>
        <span className='text-gray-400'>/</span>
        <span className='text-gray-800'>
          {inventoryName || selectedInventory?.name || ''}
        </span>
      </div>

      {/* Inventory Dropdown */}
      {showSkeleton ? (
        <SkeletonBar style={{ height: 36, width: 200, borderRadius: 6 }} />
      ) : (
        <InventoryDropdown
          inventories={inventories}
          selectedInventory={selectedInventory}
          onSelect={onSelectInventory}
          error={inventoryError}
        />
      )}
    </div>
  );
}
