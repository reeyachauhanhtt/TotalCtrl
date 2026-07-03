import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
// import { Tooltip } from 'react-tooltip';

import { fetchInventory } from '../../services/inventoryService';
import { setSelectedInventory } from '../../store/inventorySlice';
import AddOrderManuallyModal from '../ExternalOrder/AddOrderManuallyModal';
import InventoryDropdown from '../Common/InventoryDropDown';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import AppTooltip from '../Common/Tooltip';
import { SkeletonBar, ExternalOrderHeaderSkeleton } from '../Common/Skeleton';

export default function ExternalOrderHeader({ onUploadClick, onError }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const isViewOnly =
    selectedInventory &&
    selectedInventory.permission?.toLowerCase() !== 'editor' &&
    selectedInventory.permission?.toLowerCase() !== 'owner';

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
      <h1 className='ml-6 text-[24px] font-semibold text-gray-800'>
        External Orders
      </h1>

      {/* Right section — hidden on detail view */}
      {!isDetailOpen && (
        <div className='flex items-center gap-4'>
          {isLoading || showSkeleton ? (
            <>
              <SkeletonBar
                style={{ height: 38, width: 320, borderRadius: 6 }}
              />
              <SkeletonBar
                style={{ height: 38, width: 208, borderRadius: 6 }}
              />
              <SkeletonBar
                style={{ height: 38, width: 208, borderRadius: 6 }}
              />
            </>
          ) : (
            <>
              {/* Inventory Dropdown */}
              <InventoryDropdown
                inventories={inventories}
                selectedInventory={selectedInventory}
                onSelect={(inv) => dispatch(setSelectedInventory(inv))}
                error={error}
              />

              {/* Add Order Manually */}
              <div>
                <WhiteButton
                  {...(!isViewOnly && {
                    'data-tooltip-id': 'add-order-tooltip',
                    'data-tooltip-content':
                      'Use this option to add orders without PDF order confirmation from supplier',
                  })}
                  onClick={() => !isViewOnly && setShowAddModal(true)}
                  disabled={isViewOnly}
                  className={`h-10 w-52 flex items-center justify-center gap-2 font-extrabold transition-opacity ${
                    isViewOnly
                      ? 'opacity-40 cursor-default pointer-events-none'
                      : ''
                  }`}
                >
                  <img
                    src='/icons/plus-dark.svg'
                    alt=''
                    width={18}
                    height={18}
                  />
                  <span>Add order manually</span>
                </WhiteButton>
                <AppTooltip
                  id='add-order-tooltip'
                  place='bottom'
                  style={{
                    // backgroundColor: '#19191c',
                    // fontSize: 12,
                    maxWidth: 208,
                  }}
                />
              </div>

              {/* Upload Order */}
              <div>
                <GreenButton
                  {...(!isViewOnly && {
                    'data-tooltip-id': 'upload-order-tooltip',
                    'data-tooltip-content':
                      "Does your supplier send you PDF confirmation receipts for your orders?Upload the PDF file here and we'll to automatically extract order and product data for you.",
                  })}
                  onClick={() => !isViewOnly && onUploadClick?.()}
                  disabled={isViewOnly}
                  disabledCursor='default'
                  className={`h-10 px-10 flex items-center gap-2 font-semibold transition-opacity ${
                    isViewOnly
                      ? 'opacity-40 cursor-default pointer-events-none'
                      : ''
                  }`}
                >
                  <img src='/icons/upload.svg' alt='' width={20} height={20} />
                  <span>Upload order</span>
                </GreenButton>
                <AppTooltip
                  id='upload-order-tooltip'
                  place='bottom-end'
                  style={{
                    maxWidth: 250,
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      <AddOrderManuallyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onError={onError}
      />
    </div>
  );
}
