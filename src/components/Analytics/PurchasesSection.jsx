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
    queryKey: ['analyticsPurchases', dateRange],
    queryFn: () => fetchPurchases(dateRange),
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
