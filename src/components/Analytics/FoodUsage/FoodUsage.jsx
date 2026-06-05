import { useState } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import ProgressBar from '../../Analytics/common/ProgressBar';
import ExportButton from '../../Analytics/common/ExportButton';
import MonthPicker from '../../Analytics/common/MonthPicker';
import FoodUsageTable from '../../Analytics/FoodUsage/FoodUsageTable';
import {
  fetchFoodUsageTotal,
  fetchFoodUsageProducts,
} from '../../../services/foodUsageService';
import { formatPrice } from '../../../utils/format';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';

const LIMIT = 10;

function mapProduct(product) {
  const {
    name,
    totalUseQty,
    totalUseValue,
    totalWasteQty,
    totalWasteValue,
    totalCheckoutQty,
    totalCheckoutValue,
    stockTakingUnit,
    stockTakingUnitPlural,
  } = product;

  const unit = (qty) =>
    `${qty} ${Math.abs(qty) === 1 ? stockTakingUnit : stockTakingUnitPlural}`;

  return {
    name,
    usedFood: unit(totalUseQty),
    usedFoodValue: formatPrice(totalUseValue ?? 0),
    foodWaste: unit(totalWasteQty),
    foodWasteValue: formatPrice(totalWasteValue ?? 0),
    total: unit(totalCheckoutQty),
    checkedOut: formatPrice(totalCheckoutValue ?? 0),
  };
}

export default function FoodUsage({ inventoryId, onTabChange }) {
  const [dateRange, setDateRange] = useState(
    getPersistedDateRange() ?? {
      fromDate: new Date().toISOString().slice(0, 8) + '01',
      toDate: new Date().toISOString().slice(0, 10),
    },
  );

  const { data: totalResult } = useQuery({
    queryKey: ['foodUsageTotal', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodUsageTotal({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId,
  });

  const totalData =
    totalResult?.Data?.foodUsage?.find((f) => f.inventoryId === inventoryId) ??
    totalResult?.Data?.foodUsage?.[0] ??
    null;

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['foodUsageProducts', inventoryId, dateRange],
    queryFn: ({ pageParam = 0 }) =>
      fetchFoodUsageProducts({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: LIMIT,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const lastBatch = lastPage?.Data?.products ?? [];
      if (lastBatch.length < LIMIT) return undefined;
      return allPages.reduce(
        (acc, p) => acc + (p?.Data?.products?.length ?? 0),
        0,
      );
    },
    enabled: !!inventoryId,
  });

  const rows =
    data?.pages.flatMap((p) => (p?.Data?.products ?? []).map(mapProduct)) ?? [];

  function handleDateApply({ startDate, endDate }) {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
    });
  }

  function handleExport() {
    // TODO: wire to export endpoint when available
  }

  const totalCheckout = formatPrice(totalData?.totalCheckoutValue ?? 0);
  const usedFoodValue = formatPrice(totalData?.totalUseValue ?? 0);
  const foodWasteValue = formatPrice(totalData?.totalWasteValue ?? 0);
  const usedFoodPercent = totalData?.usagePercentage ?? 0;
  const foodWastePercent = totalData?.wastePercentage ?? 0;

  console.log('totalResult', totalResult?.Data?.foodUsage);
  console.log('inventoryId', inventoryId);

  return (
    <div
      className='overflow-hidden overflow-y-auto fixed px-8.75 pb-15'
      style={{ width: 'calc(100% - 200px)', height: 'calc(100% - 200px)' }}
    >
      {/* Header */}
      <div className='flex items-center justify-between w-full py-9.5'>
        <span className='font-semibold text-[22px] leading-7 tracking-[-0.01em] text-[#19191c]'>
          Food Usage
        </span>
        <div className='flex items-center gap-5'>
          <ExportButton
            onClick={handleExport}
            disabled={isLoading || rows.length === 0}
          />
          <MonthPicker onApply={handleDateApply} />
        </div>
      </div>

      {/* Progress Stats */}
      <div className='flex gap-0' style={{ lineHeight: 'normal' }}>
        <div style={{ width: 268 }}>
          <span className='text-[14px] leading-5 font-normal text-[#19191c]'>
            Total value of checked out food
          </span>
          <h2 className='text-[32px] leading-10 font-semibold tracking-[-0.01em] text-[#19191c] m-0 mt-1'>
            {totalCheckout}
          </h2>
          <div className='mt-2'>
            <ProgressBar value={totalData?.totalCheckoutPercentage ?? 100} />
          </div>
        </div>

        <div style={{ width: 268 }}>
          <span className='text-[14px] leading-5 font-normal text-[#19191c]'>
            Used Food ({usedFoodPercent.toFixed(2)} %)
          </span>
          <h2 className='text-[32px] leading-10 font-semibold tracking-[-0.01em] text-[#19191c] m-0 mt-1'>
            {usedFoodValue}
          </h2>
          <div className='mt-2'>
            <ProgressBar value={usedFoodPercent} />
          </div>
        </div>

        <div style={{ width: 268 }}>
          <span className='text-[14px] leading-5 font-normal text-[#19191c]'>
            Food Waste ({foodWastePercent.toFixed(2)} %)
          </span>
          <h2 className='text-[32px] leading-10 font-semibold tracking-[-0.01em] text-[#19191c] m-0 mt-1'>
            {foodWasteValue}
          </h2>
          <div className='mt-2'>
            <ProgressBar value={foodWastePercent} />
          </div>
        </div>
      </div>

      <FoodUsageTable
        data={rows}
        loading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}
