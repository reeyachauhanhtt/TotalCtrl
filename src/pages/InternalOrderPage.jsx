import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import OrderTabs from '../components/Common/OrderTab';
import InternalOrderTable from '../components/InternalOrder/InternalOrderTable';
import { fetchInternalOrders } from '../services/internalOrderService';

const STATUS_LABEL_MAP = {
  scheduled: 'Scheduled',
  'partially delivered': 'Partially Delivered',
  delivered: 'Delivered',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return format(new Date(dateStr), 'dd MMM yyyy');
}

export default function InternalOrderPage() {
  const [activeTab, setActiveTab] = useState('Scheduled');
  const [showReturnSkeleton, setShowReturnSkeleton] = useState(false);
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const statusParam = activeTab.toLowerCase().replace(' ', '-');

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['internal-order', selectedInventory?.id, activeTab],
    queryFn: () =>
      fetchInternalOrders({
        inventoryId: selectedInventory?.id,
        status: statusParam,
      }),
    enabled: !!selectedInventory?.id,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  const orders = (data?.Data ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    fromInventory: o.fromInventory?.name,
    toInventory: o.toInventory?.name,
    orderedAt: formatDate(o.orderedAt),
    lastDeliveredAt: o.lastDeliveredAt ? formatDate(o.lastDeliveredAt) : null,
    status: STATUS_LABEL_MAP[o.status] ?? o.status,
    totalItems: o.totalItems,
  }));

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <InternalOrderTable
        orders={orders}
        isLoading={isLoading || isFetching || showReturnSkeleton}
        isError={isError}
        onRowClick={(order) => {}}
        activeTab={activeTab}
        onAddOrderClick={() => {}}
        isReady={!!selectedInventory?.id}
      />
    </div>
  );
}
