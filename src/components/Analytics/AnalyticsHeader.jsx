import InventoryDropdown from '../Common/InventoryDropDown';

export default function AnalyticsHeader() {
  return (
    <div className='h-20 flex items-center px-10 border-b border-gray-200 bg-white'>
      <h1 className='text-[20px] font-semibold text-gray-900'>Analytics</h1>
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
}) {
  return (
    <div className='h-18 flex items-center justify-between px-10 border-b border-gray-200 bg-white'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-1 text-[13px]'>
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
      <InventoryDropdown
        inventories={inventories}
        selectedInventory={selectedInventory}
        onSelect={onSelectInventory}
        error={inventoryError}
      />
    </div>
  );
}
