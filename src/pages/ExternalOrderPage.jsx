import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import OrderTabs from '../components/Common/OrderTab';
import ExternalOrderTable from '../components/ExternalOrder/ExternalOrderTable';
import ExternalOrderDetail from '../components/ExternalOrder/ExternalOrderDetail';
import AddOrderManuallyModal from '../components/ExternalOrder/AddOrderManuallyModal';
import UploadOrderModal from '../components/ExternalOrder/UploadOrderModal';
import UploadingOrdersDrawer from '../components/ExternalOrder/UploadingOrderDrawer';
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
  const [uploadingOrders] = useState([
    { name: 'TINE Order.pdf', size: 53015, inventoryName: '' },
    { name: 'TINE Order.pdf', size: 53015, inventoryName: '' },
    { name: 'TINE Order.pdf', size: 53015, inventoryName: '' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showReturnSkeleton, setShowReturnSkeleton] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);
  const selectedOrder = useSelector((s) => s.externalOrder.selectedOrder);

  const prevDetailOpen = useRef(false);

  useEffect(() => {
    if (prevDetailOpen.current === true && !isDetailOpen) {
      // user just came back from detail
      setShowReturnSkeleton(true);
      queryClient.removeQueries({ queryKey: ['external-orders'] });
      setTimeout(() => setShowReturnSkeleton(false), 1200);
    }
    prevDetailOpen.current = isDetailOpen;
  }, [isDetailOpen]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['external-orders', selectedInventory?.id, activeTab],
    queryFn: () =>
      fetchExternalOrders({
        inventoryId: selectedInventory?.id,
        tab: activeTab,
      }),
    enabled: !!selectedInventory?.id,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
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

  if (isDetailOpen && selectedOrder) {
    return (
      <>
        <ExternalOrderDetail
          order={selectedOrder}
          onUploadClick={() => setShowUploadModal(true)}
          onBack={(result) => {
            if (result?.toast) {
              setToastMessage(result.toast);
              setTimeout(() => setToastMessage(null), 2000);
            }
          }}
        />

        {toastMessage && (
          <div
            className='fixed bottom-0 right-0 z-50'
            style={{ left: '200px' }}
          >
            <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm'>
              Order <strong>#{toastMessage?.number}</strong> from{' '}
              <strong>{toastMessage?.supplier}</strong> has been deleted.
            </div>
          </div>
        )}

        {uploadingOrders.length > 0 &&
          selectedOrder?.status !== 'Scheduled' && (
            <UploadingOrdersDrawer isOpen={true} orders={uploadingOrders} />
          )}
      </>
    );
  }

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ExternalOrderTable
        orders={orders}
        isLoading={isLoading || isFetching || showReturnSkeleton}
        isFetching={isFetching}
        isError={isError}
        onRowClick={(order) => {
          dispatch(setDetailOpen(true));
          dispatch(setSelectedOrder(order));
        }}
        activeTab={activeTab}
        onAddOrderClick={() => setShowAddModal(true)}
        onUploadClick={() => setShowUploadModal(true)}
        isReady={!!selectedInventory?.id}
      />

      <AddOrderManuallyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onError={(msg) => {
          setErrorToast(msg);
          setTimeout(() => setErrorToast(''), 4000);
        }}
      />

      <UploadOrderModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      {uploadingOrders.length > 0 &&
        !showUploadModal &&
        !(isDetailOpen && selectedOrder?.status === 'Scheduled') && (
          <UploadingOrdersDrawer isOpen={true} orders={uploadingOrders} />
        )}

      {toastMessage && (
        <div className='fixed bottom-0 right-0 z-50' style={{ left: '220px' }}>
          <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm'>
            Order <strong>#{toastMessage?.number}</strong> from{' '}
            <strong>{toastMessage?.supplier}</strong> has been deleted.
          </div>
        </div>
      )}

      {errorToast && (
        <div
          className='fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl'
          style={{ backgroundColor: '#19191c', minWidth: 320, zIndex: 99999 }}
        >
          <div className='flex items-center justify-center w-5 h-5 rounded-full bg-red-600 shrink-0'>
            <span className='text-white text-[11px] font-bold leading-none'>
              !
            </span>
          </div>
          <span className='text-white text-[13px] font-bold uppercase tracking-wide flex-1'>
            {errorToast}
          </span>
          <button
            onClick={() => setErrorToast('')}
            className='text-white opacity-70 hover:opacity-100 text-[16px] cursor-pointer shrink-0'
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
