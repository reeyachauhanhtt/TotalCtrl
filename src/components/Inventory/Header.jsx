import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInventory } from '../../services/inventoryService';
import { setSelectedInventory } from '../../store/inventorySlice';
import NotificationModal from '../Common/NotificationModal';
import { SkeletonBar } from '../Common/Skeleton';
import InventoryDropdown from '../Common/InventoryDropDown';

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    setShowSkeleton(true);
    const t = setTimeout(() => setShowSkeleton(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const isInventory = location.pathname.includes('/');

  const { data, error, isLoading } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const inventories = data?.Data || data?.data || [];

  useEffect(() => {
    if (inventories.length > 0 && !selectedInventory) {
      dispatch(setSelectedInventory(inventories[0]));
    }
  }, [inventories, selectedInventory, dispatch]);

  function getTitle() {
    const path = location.pathname.toLowerCase();
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('inventory-count')) return 'Inventory Count';
    if (path.includes('cogs-calculator')) return 'COGS Calculator';
    return 'Inventories';
  }

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
          isSelected ? 'bg-green-50' : ''
        }`}
      >
        <span className='text-gray-700'>{inv.name}</span>
        {isSelected && (
          <img src='/icons/check-small.svg' width={26} height={26} alt='' />
        )}
      </div>
    );
  }

  return (
    <div className='h-23 flex items-center justify-between px-4 border-b border-gray-200 bg-white relative'>
      {isLoading || showSkeleton ? (
        <>
          <SkeletonBar
            style={{ height: 25, width: 150, borderRadius: 6, marginLeft: 24 }}
          />
        </>
      ) : (
        <h1 className='text-[22px] ml-6 font-semibold text-gray-800'>
          {getTitle()}
        </h1>
      )}

      <div className='flex items-center gap-4'>
        {isLoading || showSkeleton ? (
          <>
            <SkeletonBar
              style={{
                height: 38,
                width: 320,
                borderRadius: 6,
                marginRight: 24,
              }}
            />
          </>
        ) : (
          <>
            <InventoryDropdown
              inventories={inventories}
              selectedInventory={selectedInventory}
              onSelect={(inv) => dispatch(setSelectedInventory(inv))}
              error={error}
            />
            {isInventory && (
              <div className='relative'>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className='cursor-pointer mr-6'
                >
                  <img
                    src='/img/bell-v2.png'
                    width={40}
                    height={40}
                    alt='bell'
                  />
                </button>
                <NotificationModal
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
