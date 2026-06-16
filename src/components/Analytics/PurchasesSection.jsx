import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, format } from 'date-fns';

import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';
import { fetchPurchases } from '../../services/analyticsService';
import { formatPrice } from '../../utils/format';
import { getPersistedDateRange } from '../../utils/analyticsDateRange';
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
  setAnalyticsSelectedTab,
} from '../../store/analyticsSlice';

export default function PurchasesSection() {
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

  const { data, isFetching, error } = useQuery({
    queryKey: ['analyticsPurchases', dateRange],
    queryFn: () => fetchPurchases(dateRange),
    // queryFn: () =>
    //   new Promise((r) => setTimeout(r, 5000)).then(() =>
    //     fetchPurchases(dateRange),
    //   ),
    staleTime: 0,
    gcTime: 0,
  });

  const purchases = data?.Data?.purchaseValue || [];

  const hasData = purchases.some((inv) => inv.totalPurchases > 0);

  // console.log('dateRange', dateRange);
  // console.log('error', error);

  function handleApplyDateRange(range) {
    setDateRange({
      fromDate: format(range.startDate, 'yyyy-MM-dd'),
      toDate: format(range.endDate, 'yyyy-MM-dd'),
    });
  }

  return (
    <div style={{ marginTop: 50 }}>
      <SectionHeader
        title='Purchases'
        showMonthPicker
        onApplyDateRange={handleApplyDateRange}
        hasData={hasData}
      />

      {isFetching && (
        <div
          className='flex flex-wrap w-full overflow-hidden rounded-lg'
          style={{
            border: '1px solid #e7e7ec',
            boxShadow:
              '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <InventoryCard key={i} variant='purchases' isLoading />
          ))}
        </div>
      )}

      {error && (
        <div className='text-sm text-red-400 py-4'>Failed to load data.</div>
      )}

      {!isFetching && !error && (
        <div
          className='flex flex-wrap w-full overflow-hidden rounded-lg'
          style={{
            border: '1px solid #e7e7ec',
            boxShadow:
              '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
          }}
        >
          {purchases.map((inv) => (
            <InventoryCard
              key={inv.inventoryId}
              variant='purchases'
              item={{
                name: inv.name,
                value: formatPrice(inv.totalPurchases),
                description: `${inv.totalPurchasesPercentage} % of total inventories value`,
                progress: inv.totalPurchasesPercentage,
              }}
              onViewDetails={() => {
                dispatch(
                  setAnalyticsSelectedInventory({
                    id: inv.inventoryId,
                    name: inv.name,
                  }),
                );
                dispatch(setAnalyticsDetailOpen(true));
                dispatch(setAnalyticsSelectedTab('Purchases'));
                navigate('/analytics');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
