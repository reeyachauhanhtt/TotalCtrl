import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';
import { fetchAnalyticsStockValue } from '../../services/analyticsService';
import { formatPrice } from '../../utils/format';
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
  setAnalyticsSelectedTab,
} from '../../store/analyticsSlice';
import { ANALYTICS_SECTION_TITLES } from '../../constants/titles';

export default function RealTimeInventorySection() {
  const { data, isFetching, error } = useQuery({
    queryKey: ['analyticsStockValue'],
    queryFn: fetchAnalyticsStockValue,
    // queryFn: () =>
    //   new Promise((r) => setTimeout(r, 5000)).then(() =>
    //     fetchAnalyticsStockValue(),
    //   ),
    staleTime: 0,
    gcTime: 0,
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const inventories = data?.Data?.inventoryValue || [];
  const lastUpdatedAt = data?.Data?.lastUpdatedAt;
  const lastUpdatedText = lastUpdatedAt
    ? `Last updated on ${new Date(lastUpdatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`
    : 'Last updated on Invalid Date';

  const hasData = inventories.length > 0;

  return (
    <div>
      <SectionHeader
        title={ANALYTICS_SECTION_TITLES.REAL_TIME_INVENTORY_VALUE}
        lastUpdated={lastUpdatedText}
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
            <InventoryCard key={i} variant='realtime' isLoading />
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
          {inventories.map((inv) => (
            <InventoryCard
              key={inv.inventoryId}
              variant='realtime'
              item={{
                name: inv.name,
                value: formatPrice(inv.total),
                description: `${inv.totalInventoryPercentage} % of total inventories value`,
                progress: inv.totalInventoryPercentage,
              }}
              onViewDetails={() => {
                dispatch(
                  setAnalyticsSelectedInventory({
                    id: inv.inventoryId,
                    name: inv.name,
                  }),
                );
                dispatch(setAnalyticsSelectedTab('Inventory Stats'));
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
