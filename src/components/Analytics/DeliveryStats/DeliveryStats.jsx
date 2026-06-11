import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import MonthPicker from '../common/MonthPicker';
import ExportButton from '../common/ExportButton';
import GreenButton from '../../common/GreenButton';
import {
  fetchTotalReturnedGoods,
  fetchSupplierRanking,
} from '../../../services/deliveryStatsService';

export default function DeliveryStats() {
  const navigate = useNavigate();

  const persisted = getPersistedDateRange();
  const [dateRange, setDateRange] = useState({
    fromDate: persisted.fromDate,
    toDate: persisted.toDate,
    label: 'Last Month',
  });

  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);

  const { data } = useQuery({
    queryKey: [
      'totalReturnedGoods',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchTotalReturnedGoods({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
  });

  const { data: supplierData } = useQuery({
    queryKey: [
      'supplierRanking',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchSupplierRanking({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
  });

  const suppliers = supplierData?.Data ?? [];

  const isEmpty = !data?.Data?.total && suppliers.length === 0;

  function handleDateApply({ startDate, endDate, label }) {
    setDateRange({ fromDate: startDate, toDate: endDate, label });
  }

  return (
    <div className='overflow-y-auto px-8.75 pb-15 pr-10'>
      {/* Header */}
      <div className='flex justify-between items-start mt-9.5'>
        <span className='text-[20px] font-semibold text-[#19191c] tracking-[-0.01em] leading-7'>
          Delivery Stats
        </span>
        <div className='flex items-center gap-5'>
          <ExportButton disabled={isEmpty} />
          <MonthPicker
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            label={dateRange.label}
            onApply={handleDateApply}
          />
        </div>
      </div>

      {/* Empty state */}
      <div className='h-125 w-full flex flex-col justify-center items-center'>
        <img
          src='/icons/InventoryIllustration.svg'
          alt=''
          style={{ height: 108, width: 151 }}
        />
        <span className='text-[24px] font-semibold text-[#19191c] tracking-[-0.01em] leading-8 text-center mt-6'>
          No returned goods
        </span>
        <div className='flex justify-center mt-4 mb-4 w-2/3'>
          <ul className='text-[16px] text-[#97979b] text-center font-normal tracking-[-0.16px]'>
            <li>
              We can't show any useful information without orders. Please add
            </li>
            <li> a new one using the button below.</li>
          </ul>
        </div>
        <div className='mt-4'>
          <GreenButton onClick={() => navigate('/external-orders')}>
            Add order with receipt
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
