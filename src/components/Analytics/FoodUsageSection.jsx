import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, format } from 'date-fns';

import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';
import { fetchFoodUsage } from '../../services/analyticsService';
import { formatPrice } from '../../utils/format';
import { getPersistedDateRange } from '../../utils/analyticsDateRange';
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
  setAnalyticsSelectedTab,
} from '../../store/analyticsSlice';

export default function FoodUsageSection() {
  // const today = new Date();
  // const [dateRange, setDateRange] = useState({
  //   fromDate: format(startOfMonth(today), 'yyyy-MM-dd'),
  //   toDate: format(endOfMonth(today), 'yyyy-MM-dd'),
  // });

  const today = new Date();
  const defaultRange = {
    fromDate: format(startOfMonth(today), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(today), 'yyyy-MM-dd'),
  };
  const [dateRange, setDateRange] = useState(
    getPersistedDateRange() ?? defaultRange,
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsFoodUsage', dateRange],
    queryFn: () => fetchFoodUsage(dateRange),
  });

  const foodUsage = data?.Data?.foodUsage || [];

  const hasData = foodUsage.some((inv) => inv.totalCheckoutValue > 0);

  <SectionHeader
    title='Food usage'
    showMonthPicker
    onApplyDateRange={handleApplyDateRange}
    hasData={hasData}
  />;

  function handleApplyDateRange(range) {
    setDateRange({
      fromDate: format(range.startDate, 'yyyy-MM-dd'),
      toDate: format(range.endDate, 'yyyy-MM-dd'),
    });
  }

  // console.log('dateRange', dateRange);
  // console.log('error', error);

  return (
    <div style={{ marginTop: 50 }}>
      <SectionHeader
        title='Food usage'
        showMonthPicker
        onApplyDateRange={handleApplyDateRange}
        hasData={hasData}
      />

      {isLoading && (
        <div className='text-sm text-gray-400 py-4'>Loading...</div>
      )}

      {error && (
        <div className='text-sm text-red-400 py-4'>Failed to load data.</div>
      )}

      {!isLoading && !error && (
        <div
          className='flex flex-wrap w-full overflow-hidden rounded-lg'
          style={{
            border: '1px solid #e7e7ec',
            boxShadow:
              '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
          }}
        >
          {foodUsage.map((inv) => (
            <InventoryCard
              key={inv.inventoryId}
              variant='foodusage'
              item={{
                name: inv.name,
                value: formatPrice(inv.totalCheckoutValue),
                description: 'Total value of checked out food',
                usedFoodLabel: `Used food (${inv.usagePercentage} %)`,
                usedFoodValue: formatPrice(inv.totalUseValue),
                usedFoodProgress: inv.usagePercentage,
                foodWasteLabel: `Food waste (${inv.wastePercentage} %)`,
                foodWasteValue: formatPrice(inv.totalWasteValue),
                foodWasteProgress: inv.wastePercentage,
              }}
              onViewDetails={() => {
                dispatch(
                  setAnalyticsSelectedInventory({
                    id: inv.inventoryId,
                    name: inv.name,
                  }),
                );
                dispatch(setAnalyticsSelectedTab('Food Usage'));
                dispatch(setAnalyticsDetailOpen(true));
                navigate('/analytics');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
