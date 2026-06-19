import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import SupplierSearchDropdown from '../../Common/SupplierSearchDropdown';
import GreenButton from '../../Common/GreenButton';
import { assignSupplier } from '../../../services/manageItemTemplateService';

export default function AssignSupplierModal({
  open,
  onClose,
  suppliers = [],
  checkedIds = [],
  onSuccess,
}) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierError, setSupplierError] = useState(false);

  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: assignSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      onSuccess?.();
      handleClose();
    },
  });

  function handleClose() {
    setSelectedSupplier(null);
    setSupplierError(false);
    onClose();
  }

  function handleAssign() {
    if (!selectedSupplier) {
      setSupplierError(true);
      return;
    }
    mutate({
      supplierId: selectedSupplier.Id,
      storeId: selectedInventory?.id,
      productIds: checkedIds.join(','),
    });
  }

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40'
      //   onClick={handleClose}
    >
      <div
        className='bg-white rounded w-[520px] h-100 shadow-[0_4px_4px_rgba(0,0,0,0.12)]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className='flex justify-end px-6 pt-6'>
          <button
            onClick={handleClose}
            className='cursor-pointer bg-transparent border-none p-0'
          >
            <img
              src='/icons/closepopup-icon.svg'
              alt='close'
              className='w-3.5 h-3.5'
            />
          </button>
        </div>

        {/* Body */}
        <div className='px-12 pt-6 pb-10 text-center'>
          <h2 className='text-[24px] font-semibold leading-8 tracking-[-0.24px] text-[#19191c]'>
            Selected items will be assigned to the chosen supplier
          </h2>

          <div className='py-8 flex justify-center'>
            <SupplierSearchDropdown
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              onSelect={(s) => {
                setSelectedSupplier(s);
                if (s) setSupplierError(false);
              }}
              supplierError={supplierError}
              onBlur={() => {
                if (!selectedSupplier) setSupplierError(true);
              }}
              className='!w-[350px]'
            />
          </div>

          <GreenButton
            onClick={handleAssign}
            disabled={isLoading}
            className='w-[288px] h-12 justify-center text-[14px] font-semibold'
          >
            Assign supplier
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
