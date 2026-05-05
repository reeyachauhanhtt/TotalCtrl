import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import ExternalOrderTabs from '../components/ExternalOrder/ExternalOrderTab';
import ExternalOrderTable from '../components/ExternalOrder/ExternalOrderTable';
import ExternalOrderDetail from '../components/ExternalOrder/ExternalOrderDetail';
import AddOrderManuallyModal from '../components/ExternalOrder/AddOrderManuallyModal';
import { fetchExternalOrders } from '../services/externalOrderService';
import { setDetailOpen, setSelectedOrder } from '../store/externalOrderSlice';

const STATUS_LABEL_MAP = {
  scheduled: 'Scheduled',
  'partially delivered': 'Partially Delivered',
  delivered: 'Delivered',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return format(new Date(dateStr), 'dd MMM yyyy');
}

function formatTotal(total, currency) {
  if (total == null) return '—';
  const formatted = Number(total).toLocaleString('nb-NO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (currency?.locationOfSymbol === '2')
    return `${formatted} ${currency.symbol}`;
  return `${currency?.symbol ?? ''} ${formatted}`;
}

export default function ExternalOrderPage() {
  const [activeTab, setActiveTab] = useState('Scheduled');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dispatch = useDispatch();

  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);
  const selectedOrder = useSelector((s) => s.externalOrder.selectedOrder);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['external-orders', selectedInventory?.id, activeTab],
    queryFn: () =>
      fetchExternalOrders({
        inventoryId: selectedInventory?.id,
        tab: activeTab,
      }),
    enabled: !!selectedInventory?.id,
  });

  const orders = (data?.Data ?? []).map((o) => ({
    id: o.id,
    supplier: o.supplierName,
    orderNumber: `#${o.number}`,
    totalValue: formatTotal(o.total, o.currency),
    ordered: formatDate(o.placedDate),
    scheduledDate: o.scheduledDate,
    scheduled: formatDate(o.scheduledDate),
    status: STATUS_LABEL_MAP[o.status] ?? o.status,
    inventoryName: o.inventoryName,
    number: o.number,
    itemsCount: o.itemsCount,
  }));

  function handleBack() {
    dispatch(setDetailOpen(false));
    dispatch(setSelectedOrder(null));
  }

  // ✅ place this before the if (isDetailOpen) check
  if (isDetailOpen && selectedOrder) {
    return (
      <>
        <ExternalOrderDetail
          order={selectedOrder}
          onBack={(result) => {
            dispatch(setDetailOpen(false));
            dispatch(setSelectedOrder(null));
            if (result?.toast) {
              setToastMessage(result.toast);
              setTimeout(() => setToastMessage(null), 4000);
            }
          }}
        />
        {toastMessage && (
          <div
            className='fixed bottom-0 right-0 z-50'
            style={{ left: '200px' }}
          >
            <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-[24px] px-8 py-4 rounded-sm'>
              Order <strong>#{toastMessage?.number}</strong> from{' '}
              <strong>{toastMessage?.supplier}</strong> has been deleted.
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <ExternalOrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ExternalOrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(order) => {
          dispatch(setDetailOpen(true));
          dispatch(setSelectedOrder(order));
        }}
        activeTab={activeTab}
        onAddOrderClick={() => setShowAddModal(true)}
      />

      <AddOrderManuallyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {toastMessage && (
        <div className='fixed bottom-0 right-0 z-50' style={{ left: '220px' }}>
          <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-[24px] px-8 py-4 rounded-sm'>
            Order <strong>#{toastMessage?.number}</strong> from{' '}
            <strong>{toastMessage?.supplier}</strong> has been deleted.
          </div>
        </div>
      )}
    </div>
  );
}
