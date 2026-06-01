import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';
import { fetchAnalyticsStockValue } from '../../services/analyticsService';
import { formatPrice } from '../../utils/format';

export default function RealTimeInventorySection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsStockValue'],
    queryFn: fetchAnalyticsStockValue,
  });

  const inventories = data?.Data?.inventoryValue || [];
  const lastUpdatedAt = data?.Data?.lastUpdatedAt;
  const lastUpdatedText = lastUpdatedAt
    ? `Last updated on ${new Date(lastUpdatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`
    : 'Last updated on Invalid Date';

  return (
    <div>
      <SectionHeader
        title='Real time inventory value'
        lastUpdated={lastUpdatedText}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
