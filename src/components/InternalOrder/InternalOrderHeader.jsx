import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInventory } from '../../services/inventoryService';
import { setSelectedInventory } from '../../store/inventorySlice';
import InventoryDropdown from '../Common/InventoryDropDown';
import WhiteButton from '../Common/WhiteButton';
import { SkeletonBar } from '../Common/Skeleton';

export default function InternalOrderHeader({ onAddClick }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    setShowSkeleton(true);
    const t = setTimeout(() => setShowSkeleton(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

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

  return (
    <div className='h-23 flex items-center justify-between px-4 border-b border-gray-200 bg-white relative'>
      <h1 className='ml-6 text-[22px] font-semibold text-gray-800'>
        Internal Orders
      </h1>

      <div className='flex items-center gap-4 mr-4'>
        {isLoading || showSkeleton ? (
          <>
            <SkeletonBar style={{ height: 38, width: 320, borderRadius: 6 }} />
            <SkeletonBar style={{ height: 38, width: 180, borderRadius: 6 }} />
          </>
        ) : (
          <>
            <InventoryDropdown
              inventories={inventories}
              selectedInventory={selectedInventory}
              onSelect={(inv) => dispatch(setSelectedInventory(inv))}
              error={error}
            />

            <WhiteButton
              onClick={() => onAddClick?.()}
              className='h-10 w-52 flex items-center justify-center gap-2 font-extrabold'
            >
              <img src='/icons/plus-dark.svg' alt='' width={16} height={16} />
              <span>Add internal order</span>
            </WhiteButton>
          </>
        )}
      </div>
    </div>
  );
}
