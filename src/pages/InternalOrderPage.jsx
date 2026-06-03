import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';

import OrderTabs from '../components/Common/OrderTab';
import InternalOrderTable from '../components/InternalOrder/InternalOrderTable';
import InternalOrderDetail from '../components/InternalOrder/InternalOrderDetail';
import { fetchInternalOrders } from '../services/internalOrderService';
import {
  setInternalDetailOpen,
  setSelectedInternalOrder,
} from '../store/internalOrderSlice';
import AddInternalOrder from '../components/InternalOrder/AddInternalOrder';

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
  const dispatch = useDispatch();

  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.internalOrder.isDetailOpen);
  const selectedOrder = useSelector((s) => s.internalOrder.selectedOrder);

  const statusParam = activeTab.toLowerCase().replace(' ', '-');

  const queryClient = useQueryClient();

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

  const prevDetailOpen = useRef(false);

  useEffect(() => {
    return () => {
      dispatch(setInternalDetailOpen(false));
      dispatch(setSelectedInternalOrder(null));
    };
  }, []);

  useEffect(() => {
    if (prevDetailOpen.current === true && !isDetailOpen) {
      // user just came back from detail
      setShowReturnSkeleton(true);
      queryClient.removeQueries({
        queryKey: ['internal-order', selectedInventory?.id, activeTab],
      });
      setTimeout(() => setShowReturnSkeleton(false), 1200);
    }
    prevDetailOpen.current = isDetailOpen;
  }, [isDetailOpen]);

  const orders = (data?.Data ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    fromInventory: o.fromInventory,
    toInventory: o.toInventory,
    orderedAt: o.orderedAt,
    lastDeliveredAt: o.lastDeliveredAt,
    status: o.status,
    totalItems: o.totalItems,
    fromInventoryName: o.fromInventory?.name,
    toInventoryName: o.toInventory?.name,
    orderedAtFormatted: formatDate(o.orderedAt),
    lastDeliveredAtFormatted: o.lastDeliveredAt
      ? formatDate(o.lastDeliveredAt)
      : null,
    statusLabel: STATUS_LABEL_MAP[o.status] ?? o.status,
  }));

  function handleRowClick(order) {
    dispatch(setSelectedInternalOrder(order));
    dispatch(setInternalDetailOpen(true));
  }

  if (isDetailOpen && selectedOrder) {
    return <InternalOrderDetail order={selectedOrder} />;
  }
  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <InternalOrderTable
        orders={orders}
        isLoading={isLoading || isFetching || showReturnSkeleton}
        isError={isError}
        onRowClick={handleRowClick}
        activeTab={activeTab}
        onAddOrderClick={() => setShowAddModal(true)}
        isReady={!!selectedInventory?.id}
      />
    </div>
  );
}
