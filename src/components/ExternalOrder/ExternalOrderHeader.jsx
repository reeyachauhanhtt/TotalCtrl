import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInventory } from '../../services/inventoryService';
import { setSelectedInventory } from '../../store/inventorySlice';
import AddOrderManuallyModal from '../ExternalOrder/AddOrderManuallyModal';

export default function ExternalOrderHeader() {
  const dispatch = useDispatch();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const dropdownRef = useRef(null);

  const { data, error } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const inventories = data?.Data || data?.data || [];

  useEffect(() => {
    if (inventories.length > 0 && !selectedInventory) {
      dispatch(setSelectedInventory(inventories[0]));
    }
  }, [inventories, selectedInventory, dispatch]);

  useEffect(() => {
    if (!openDropdown) setSearchTerm('');
  }, [openDropdown]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
        setSearchTerm('');
      }
    }
    if (openDropdown)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const filteredInventories = inventories.filter((inv) =>
    inv.name?.toLowerCase().includes(debouncedSearch),
  );

  function InventoryItem({ inv }) {
    const isSelected = selectedInventory?.id === inv.id;
    return (
      <div
        onClick={() => {
          dispatch(setSelectedInventory(inv));
          setOpenDropdown(false);
          setSearchTerm('');
        }}
        className={`px-8 py-4 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-50 ${
          isSelected ? 'bg-emerald-50' : ''
        }`}
      >
        <span className='text-gray-700'>{inv.name}</span>
        {isSelected && (
          <img src='/icons/check-small.svg' width={26} height={26} alt='' />
        )}
      </div>
    );
  }

  console.log('isDetailOpen:', isDetailOpen);

  return (
    <div className='h-23 flex items-center justify-between px-4 border-b border-gray-200 bg-white relative'>
      <h1 className='text-[22px] font-semibold text-gray-800'>
        External Orders
      </h1>
      {/* Right section — hidden on detail view */}
      {!isDetailOpen && (
        <div className='flex items-center gap-4'>
          {/* Inventory Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <div
              className={`flex items-center gap-2 rounded-sm w-80 h-10 px-3 py-1.5 text-xs text-gray-700 transition ${
                openDropdown
                  ? 'border-2 border-emerald-600'
                  : 'border border-gray-300 hover:border-gray-500'
              }`}
              onClick={() => setOpenDropdown(true)}
            >
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOpenDropdown(true);
                }}
                placeholder={selectedInventory?.name || 'Select inventory'}
                className='flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-600'
              />
              <img
                src='/icons/chevron-down-small.svg'
                width={26}
                height={26}
                alt=''
                className={`transition ${openDropdown ? 'opacity-100' : 'opacity-50'}`}
              />
            </div>

            {openDropdown && (
              <div className='absolute top-full mt-2 w-80 h-75 mr-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-100 overflow-y-auto'>
                {error ? (
                  <div className='px-8 py-10 text-sm text-red-500'>
                    Failed to load inventories
                  </div>
                ) : filteredInventories.length === 0 ? (
                  <div className='px-8 py-10 text-sm text-gray-400'>
                    No inventories found
                  </div>
                ) : (
                  <>
                    {filteredInventories.filter(
                      (inv) =>
                        inv.permission?.toLowerCase() === 'editor' ||
                        inv.permission?.toLowerCase() === 'owner',
                    ).length > 0 && (
                      <>
                        <div className='px-8 py-10 pt-6 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
                          You can edit
                          <div className='px-8 border-t border-gray-100 my-1' />
                        </div>
                        {filteredInventories
                          .filter(
                            (inv) =>
                              inv.permission?.toLowerCase() === 'editor' ||
                              inv.permission?.toLowerCase() === 'owner',
                          )
                          .map((inv) => (
                            <InventoryItem key={inv.id} inv={inv} />
                          ))}
                      </>
                    )}

                    {filteredInventories.filter(
                      (inv) =>
                        inv.permission?.toLowerCase() !== 'editor' &&
                        inv.permission?.toLowerCase() !== 'owner',
                    ).length > 0 && (
                      <>
                        <div className='px-8 py-10 pt-6 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
                          You can view
                          <div className='px-8 border-t border-gray-100 my-1' />
                        </div>
                        {filteredInventories
                          .filter(
                            (inv) =>
                              inv.permission?.toLowerCase() !== 'editor' &&
                              inv.permission?.toLowerCase() !== 'owner',
                          )
                          .map((inv) => (
                            <InventoryItem key={inv.id} inv={inv} />
                          ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Add Order Manually */}
          <div className='relative group'>
            <button
              onClick={() => setShowAddModal(true)}
              className='flex items-center justify-center gap-2 h-10 w-52 border border-[#d7d7db] rounded bg-transparent cursor-pointer font-extrabold text-sm text-gray-700'
            >
              <img src='/icons/plus-dark.svg' alt='' width={16} height={16} />
              <span>Add order manually</span>
            </button>
            <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#19191c] text-white text-xs rounded px-3 py-2 leading-snug z-50 hidden group-hover:block'>
              Use this option to add orders without PDF order confirmation from
              supplier
              <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#19191c] rotate-45' />
            </div>
          </div>

          {/* Upload Order */}
          <div className='relative group'>
            <a
              href='#'
              className='flex items-center gap-2 h-10 px-10 bg-[#23a956] hover:bg-[#1e9449] text-white text-sm font-semibold rounded tracking-wide transition whitespace-nowrap'
            >
              <img src='/icons/upload.svg' alt='' width={16} height={16} />
              <span>Upload order</span>
            </a>
            <div className='absolute top-full right-0 mt-2 w-80 bg-[#19191c] text-white text-xs rounded px-3 py-2 leading-snug z-50 hidden group-hover:block'>
              Does your supplier send you PDF confirmation receipts for your
              orders? Upload the PDF file here and we'll automatically extract
              the order and product data for you.
              <div className='absolute -top-1 right-12 w-2 h-2 bg-[#19191c] rotate-45' />
            </div>
          </div>
        </div>
      )}
      <AddOrderManuallyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
