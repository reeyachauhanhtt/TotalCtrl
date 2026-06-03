import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';

import ExportButton from '../common/ExportButton';
import ValueBySupplierOverview from './ValueBySupplierOverview';
import ValueByCategoryOverview from './ValueByCategoryOverview';
import CheckInOverview from './CheckInOverview';
import CheckOutOverview from './CheckOutOverview';
import { formatPrice } from '../../../utils/format';
import {
  fetchInventoryTotal,
  fetchValueBySupplier,
  fetchValueByCategory,
  fetchCheckInValue,
  fetchCheckOutValue,
} from '../../../services/inventoryStatsService';

export default function InventoryStats() {
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);
  const inventoryId = selectedInventory?.id;

  const today = new Date();
  const defaultRange = {
    fromDate: format(startOfMonth(today), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(today), 'yyyy-MM-dd'),
  };

  const [checkInRange, setCheckInRange] = useState(defaultRange);
  const [checkOutRange, setCheckOutRange] = useState(defaultRange);

  const { data: totalData } = useQuery({
    queryKey: ['inventoryTotal', inventoryId],
    queryFn: () => fetchInventoryTotal({ inventoryId }),
    enabled: !!inventoryId,
  });

  const { data: supplierData } = useQuery({
    queryKey: ['valueBySupplier', inventoryId],
    queryFn: () => fetchValueBySupplier({ inventoryId, limit: 4 }),
    enabled: !!inventoryId,
  });

  const { data: categoryData } = useQuery({
    queryKey: ['valueByCategory', inventoryId],
    queryFn: () => fetchValueByCategory({ inventoryId, limit: 4 }),
    enabled: !!inventoryId,
  });

  const { data: checkInData } = useQuery({
    queryKey: ['checkInValue', inventoryId, checkInRange],
    queryFn: () =>
      fetchCheckInValue({ inventoryId, ...checkInRange, limit: 4 }),
    enabled: !!inventoryId,
  });

  const { data: checkOutData } = useQuery({
    queryKey: ['checkOutValue', inventoryId, checkOutRange],
    queryFn: () =>
      fetchCheckOutValue({ inventoryId, ...checkOutRange, limit: 4 }),
    enabled: !!inventoryId,
  });

  const inventoryName =
    totalData?.Data?.inventoryValue?.[0]?.name ?? selectedInventory?.name;
  const totalValue = totalData?.Data?.inventoryValue?.[0]?.total;

  const suppliers = supplierData?.Data?.Data || [];
  const categories = categoryData?.Data?.Data || [];

  const checkInTotal = checkInData?.Data?.TotalValue ?? 0;
  const checkInRows = checkInData?.Data?.Data || [];
  const checkOutTotal = checkOutData?.Data?.TotalValue ?? 0;
  const checkOutRows = checkOutData?.Data?.Data || [];

  return (
    <div className='px-8.75 pr-10 pb-15'>
      {/* Title + Export */}
      <div className='flex items-start justify-between mt-9.5'>
        <div>
          <span className='font-semibold text-[22px] leading-7 tracking-[-0.01em] text-[#19191c]'>
            Inventory
          </span>

          <div className='mt-12'>
            <label className='block font-extrabold! text-[12px] leading-4 tracking-[0.08em] uppercase text-[#6b6b6f] mb-4'>
              Total Inventory Value
            </label>
            <label className='block text-[64px] font-medium leading-16 tracking-[-0.01em] text-[#19191c]'>
              {totalValue != null ? formatPrice(totalValue) : '—'}
            </label>
          </div>
        </div>

        <div className='py-0 px-20 h-9'>
          <ExportButton />
        </div>
      </div>

      {/* Value by Supplier + Category */}
      <div className='flex w-full mt-8 gap-14 pr-30'>
        <div className='flex-1 min-w-0'>
          <ValueBySupplierOverview rows={suppliers} onViewMore={() => {}} />
        </div>

        <div className='flex-1 min-w-0'>
          <ValueByCategoryOverview rows={categories} onViewMore={() => {}} />
        </div>
      </div>

      {/* Check in & out value label */}
      <div className='mt-10'>
        <span className='font-semibold text-[12px] leading-4 tracking-[0.08em] uppercase text-[#6b6b6f]'>
          Check in & out value
        </span>
      </div>

      {/* Check In + Check Out */}
      <div className='flex w-full mt-8 gap-14 pr-30'>
        <CheckInOverview
          total={checkInTotal}
          rows={checkInRows}
          onApplyDateRange={(range) =>
            setCheckInRange({
              fromDate: format(range.startDate, 'yyyy-MM-dd'),
              toDate: format(range.endDate, 'yyyy-MM-dd'),
            })
          }
          onViewMore={() => {}}
        />

        <CheckOutOverview
          total={checkOutTotal}
          rows={checkOutRows}
          onApplyDateRange={(range) =>
            setCheckOutRange({
              fromDate: format(range.startDate, 'yyyy-MM-dd'),
              toDate: format(range.endDate, 'yyyy-MM-dd'),
            })
          }
          onViewMore={() => {}}
        />
      </div>
    </div>
  );
}
