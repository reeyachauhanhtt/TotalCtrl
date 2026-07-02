import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { canEdit, PERMISSIONS } from '../../constants/permissions';
import {
  fetchOrderDetail,
  fetchDeliveredOrderDetail,
  updateOrder,
  deleteOrder,
} from '../../services/externalOrderService';
import { fetchInventory } from '../../services/inventoryService';
import { fetchSuppliers } from '../../services/supplierService';
import {
  fetchMeasurementUnits,
  fetchQualityIssues,
} from '../../services/masterDataService';
import { setSelectedOrder } from '../../store/externalOrderSlice';
import ConfirmModal from '../Common/ConfirmModal';
import StatusBadge from '../Common/StatusBadge';
import EditOrderModal from '../ExternalOrder/EditOrderModal';
import { ExternalOrderDetailSkeleton } from '../Common/Skeleton';
import { EXTERNAL_ORDER_MODAL_TITLES } from '../../constants/titles';

const STATUS_LABEL_MAP = {
  scheduled: 'Scheduled',
  'partially delivered': 'Partially Delivered',
  delivered: 'Delivered',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return format(new Date(dateStr), 'dd MMM yyyy');
}

function formatOrderedDate(dateStr, status) {
  if (!dateStr) return '—';

  if (status === 'Partially Delivered') {
    return format(new Date(dateStr), 'EEE dd MMM yyyy');
  }

  return format(new Date(dateStr), 'dd MMM yyyy');
}

function formatScheduledDate(dateStr) {
  if (!dateStr) return '—';
  return format(new Date(dateStr), 'dd MMM yyyy (EEE)');
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

const SCHEDULED_COLUMNS = [
  { label: 'Items', align: 'left', width: '40%' },
  { label: 'Quantity', align: 'right', width: '15%' },
  { label: 'Price Per Purchase Unit', align: 'right', width: '20%' },
  { label: 'Total Value', align: 'right', width: '15%' },
  { label: '', align: 'right', width: '10%' },
];

const GROUPED_COLUMNS = [
  { label: 'Items', align: 'left', width: '40%' },
  { label: 'Quantity', align: 'right', width: '20%' },
  { label: 'Price Per Purchase Unit', align: 'right', width: '20%' },
  { label: 'Total Value', align: 'right', width: '20%' },
];

function GroupedTable({ group, currency, qualityIssueMap }) {
  return (
    <div>
      <h2
        style={{
          borderBottom: '1px solid #e6e6ed',
          borderTop: '1px solid #e6e6ed',
          backgroundColor: '#f8f9fa',
          padding: '15px 30px',
          color: '#000',
          fontWeight: 600,
          fontSize: '18px',
          marginBottom: '0',
          marginTop: '0',
        }}
      >
        {group.title}
      </h2>

      <table className='border-collapse text-[13px] w-full'>
        <thead>
          <tr>
            {GROUPED_COLUMNS.map((col, i) => (
              <th
                key={i}
                style={{
                  width: col.width,
                  textAlign: col.align,
                  paddingLeft: i === 0 ? '30px' : undefined,
                  paddingRight:
                    i === GROUPED_COLUMNS.length - 1 ? '30px' : undefined,
                }}
                className='h-12 py-1.25 text-[12px] font-semibold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa]'
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.products.map((p) => (
            <>
              <tr key={p.id}>
                <td
                  className={`text-[14px] leading-4 text-[#19191c] font-normal ${p.hasIssue !== 1 ? 'border-b border-[#e6e6ed]' : ''} align-top text-left`}
                  style={{
                    width: '40%',
                    padding: '2.5% 0% 2% 30px',
                    verticalAlign: 'top',
                    height: '72px',
                  }}
                >
                  <label className='font-semibold text-[#19191c]'>
                    {p.name}
                  </label>
                </td>
                <td
                  className={`text-[14px] leading-4 text-[#19191c] font-normal ${p.hasIssue !== 1 ? 'border-b border-[#e6e6ed]' : ''} align-top text-right`}
                  style={{
                    width: '20%',
                    padding: '2.5% 0% 2%',
                    verticalAlign: 'top',
                    height: '72px',
                  }}
                >
                  {p.acceptedQuantity}{' '}
                  {p.acceptedQuantity === 1
                    ? p.purchaseUnit
                    : p.purchaseUnitPlural}
                </td>
                <td
                  className={`text-[14px] leading-4 text-[#19191c] font-normal ${p.hasIssue !== 1 ? 'border-b border-[#e6e6ed]' : ''} align-top text-right`}
                  style={{
                    width: '20%',
                    padding: '2.5% 0% 2%',
                    verticalAlign: 'top',
                    height: '72px',
                  }}
                >
                  {formatTotal(p.pricePerPurchaseUnit, currency)}
                </td>
                <td
                  className={`text-[14px] leading-4 text-[#19191c] font-normal ${p.hasIssue !== 1 ? 'border-b border-[#e6e6ed]' : ''} align-top text-right`}
                  style={{
                    width: '20%',
                    color: '#19191c',
                    fontWeight: '600',
                    padding: '2.5% 30px 2% 0%',
                    verticalAlign: 'top',
                    height: '72px',
                  }}
                >
                  {formatTotal(p.subtotal, currency)}
                </td>
              </tr>

              {p.hasIssue === 1 && (
                <tr key={`${p.id}-issue`}>
                  <td
                    colSpan={4}
                    style={{
                      paddingTop: '0',
                      paddingBottom: '24px',
                      borderBottom: '1px solid #e6e6ed',
                      borderTop: 'none',
                      height: 'auto',
                    }}
                  >
                    <div
                      style={{
                        width: '95%',
                        margin: '0 0 0 30px',
                        padding: '5px 0',
                      }}
                    >
                      <div
                        style={{
                          background: '#fff0f1',
                          color: '#a71a23',
                          fontWeight: '600',
                          fontSize: '14px',
                          lineHeight: '18px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 12px 4px 0',
                        }}
                      >
                        <img
                          src='/icons/error.svg'
                          alt=''
                          style={{ marginLeft: '18px', width: '20px' }}
                        />
                        <label style={{ margin: '9px' }}>
                          {p.qualityIssue ||
                            qualityIssueMap?.[p.qualityIssueId] ||
                            p.quantityIssue ||
                            'Not fresh'}
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ExternalOrderDetail({ order, onBack, onUploadClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleBack = (options) => {
    queryClient.removeQueries({ queryKey: ['order-detail', order.id] });
    queryClient.removeQueries({
      queryKey: ['order-delivered-detail', order.id, orderStatus],
    });
    onBack(options);
  };

  const { data: inventoryData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const { data: suppliersData = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 0,
  });

  const { data: unitData } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const units =
    unitData?.purchaseUnit?.length > 0
      ? unitData.purchaseUnit.map((u) => ({
          label: u.name,
          value: u.name,
          id: u.id,
        }))
      : [];

  const { data: qualityIssuesData } = useQuery({
    queryKey: ['quality-issues'],
    queryFn: fetchQualityIssues,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const qualityIssueMap = Object.fromEntries(
    (qualityIssuesData?.Data ?? []).map((q) => [q.id, q.translatedName]),
  );

  const inventories = (inventoryData?.Data || inventoryData?.data || []).sort(
    (a, b) => a.name?.localeCompare(b.name),
  );

  const orderStatus = order.status;
  const isScheduledOrder = orderStatus === 'Scheduled';

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['order-detail', order.id],
    queryFn: () => fetchOrderDetail(order.id),
    enabled: !!order.id && isScheduledOrder,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: deliveredData,
    isLoading: isDeliveredLoading,
    isFetching: isDeliveredFetching,
    isError: isDeliveredError,
  } = useQuery({
    queryKey: ['order-delivered-detail', order.id, orderStatus],
    queryFn: () =>
      fetchDeliveredOrderDetail({
        orderId: order.id,
        orderStatus: orderStatus,
      }),
    enabled: !!order.id && !isScheduledOrder,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const detail = data?.Data;
  const deliveredDetail = deliveredData?.Data;
  const groups = deliveredDetail?.data ?? [];

  const currency = isScheduledOrder
    ? detail?.currency
    : deliveredDetail?.currency;
  const status = isScheduledOrder
    ? (STATUS_LABEL_MAP[detail?.status] ?? order.status)
    : (STATUS_LABEL_MAP[deliveredDetail?.status?.replace('-', ' ')] ??
      order.status);

  const products = detail?.products ?? [];
  const isScheduled = isScheduledOrder;

  const supplierName = isScheduled
    ? (detail?.supplierName ?? order.supplier)
    : (deliveredDetail?.supplierName ?? order.supplier);

  const inventoryName = isScheduled
    ? (detail?.inventoryName ?? order.inventoryName)
    : (deliveredDetail?.inventoryName ?? order.inventoryName);

  const orderNumber = isScheduled
    ? (detail?.number ?? order.number)
    : (deliveredDetail?.number ?? order.number);

  const placedDate = isScheduled
    ? detail?.placedDate
    : deliveredDetail?.placedDate;

  const scheduledDate = isScheduled
    ? detail?.scheduledDate
    : deliveredDetail?.scheduledDate;

  const total = isScheduled ? detail?.total : deliveredDetail?.total;

  const itemsCount = isScheduled
    ? products.length || order.itemsCount
    : (deliveredDetail?.items ?? order.itemsCount);

  const isLoadingAny = isScheduled
    ? isLoading || isFetching
    : isDeliveredLoading || isDeliveredFetching;

  const isErrorAny = isScheduled ? isError : isDeliveredError;

  // permissioon who can edit the order
  const currentInventory = inventories.find(
    (inv) => inv.name === inventoryName,
  );
  const userPermission = currentInventory?.permission ?? PERMISSIONS.NO_ACCESS;
  const hasEditAccess = canEdit(userPermission);

  useEffect(() => {
    if (supplierName && orderNumber) {
      dispatch(
        setSelectedOrder({
          ...order,
          supplier: supplierName,
          number: orderNumber,
        }),
      );
    }
  }, [supplierName, orderNumber]);

  const tdBase =
    'text-[14px] leading-[16px] text-[#19191c] font-normal border-b border-[#e6e6ed] align-top py-[5px]';

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(order.id);
      queryClient.invalidateQueries({ queryKey: ['external-orders'] });
      setShowDeleteModal(false);
      handleBack({ toast: { number: orderNumber, supplier: supplierName } });
    } catch (error) {
      console.error('Failed to delete order:', error);
      setShowDeleteModal(false);
    }
  };

  if (isLoadingAny) return <ExternalOrderDetailSkeleton />;

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <div className='flex-1 overflow-auto'>
        {/* Order Info */}
        <div
          style={{
            width: '95%',
            margin: '40px auto 24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Title + Badge */}
            <div className='flex items-center' style={{ marginBottom: '5px' }}>
              <h2
                style={{
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                  color: '#19191c',
                  marginRight: '16px',
                  marginBottom: '0',
                }}
              >
                {supplierName}
              </h2>

              <label
                style={{ marginTop: '-3px' }}
                className='inline-block text-[12px] font-bold uppercase tracking-[0.08em] leading-4 px-2 py-0.5 rounded whitespace-nowrap'
              >
                <StatusBadge variant={status} className='mt-[-3px]' />
              </label>
            </div>

            {/* Inventory + Number */}
            <div
              className='flex items-center text-[16px] text-black'
              style={{ marginBottom: '25px' }}
            >
              <span
                style={{
                  borderRight: '1px solid #d7d7db',
                  paddingRight: '5px',
                  marginRight: '5px',
                }}
              >
                {inventoryName}
              </span>
              <span>#{orderNumber}</span>
            </div>

            {/* Stats */}
            <div className='flex items-center'>
              {[
                {
                  label: 'Ordered',
                  value: isScheduled
                    ? formatDate(placedDate)
                    : formatOrderedDate(placedDate, status),
                },
                {
                  label: 'Scheduled',
                  value: formatScheduledDate(scheduledDate),
                },
                { label: 'Total Value', value: formatTotal(total, currency) },
                { label: 'Items', value: itemsCount, last: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'inline-block',
                    borderRight: stat.last ? 'none' : '1px solid #d7d7db',
                    paddingRight: stat.last ? '0' : '20px',
                    paddingLeft: stat.label === 'Ordered' ? '0' : '24px',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontWeight: '600',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#6b6b6f',
                      marginBottom: '4px',
                    }}
                  >
                    {stat.label}
                  </label>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: '600',
                      fontSize: '18px',
                      lineHeight: '24px',
                      letterSpacing: '-0.01em',
                      color: '#19191c',
                      margin: '0',
                    }}
                  >
                    {isLoadingAny ? '...' : stat.value}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Actions — Scheduled only */}
          {isScheduled && (
            <div className='flex items-start justify-end gap-1'>
              <button
                onClick={() => hasEditAccess && setShowEditModal(true)}
                disabled={!hasEditAccess}
                className={`w-12 h-12 flex items-center justify-center rounded-full border border-transparent bg-transparent transition
        ${hasEditAccess ? 'cursor-pointer hover:bg-[#dcf1e3]' : 'cursor-not-allowed opacity-30'}`}
              >
                <img src='/icons/dark-edit.svg' alt='edit' />
              </button>

              <div className='relative'>
                <button
                  onClick={() => hasEditAccess && setShowDropdown((p) => !p)}
                  disabled={!hasEditAccess}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border border-transparent bg-transparent transition
          ${hasEditAccess ? 'cursor-pointer hover:bg-[#dcf1e3]' : 'cursor-not-allowed opacity-30'}`}
                >
                  <img src='/icons/dark-more.svg' alt='more' />
                </button>

                {hasEditAccess && showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '55px',
                      right: '0',
                      minWidth: '219px',
                      background: '#fff',
                      border: '1px solid #d7d7db',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
                      fontSize: '14px',
                      padding: '9px 0',
                      zIndex: 50,
                    }}
                  >
                    <div
                      className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#dcf1e3] text-[#19191c]'
                      onClick={() => {
                        setShowDropdown(false);
                        setShowDeleteModal(true);
                      }}
                    >
                      <img
                        src='/icons/dark-bin.svg'
                        width={16}
                        height={16}
                        alt=''
                      />
                      <span>Delete order</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        {isErrorAny ? (
          <div className='text-center text-red-500 text-sm py-16'>
            Failed to load order details.
          </div>
        ) : isScheduled ? (
          <div>
            <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
              <table
                className='border-collapse text-[14px]'
                style={{ width: '95%', margin: 'auto' }}
              >
                <thead>
                  <tr>
                    {SCHEDULED_COLUMNS.map((col, i) => (
                      <th
                        key={i}
                        style={{ width: col.width, textAlign: col.align }}
                        className='h-12 py-1.25 text-[12px] font-semibold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa]'
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
            <div style={{ maxHeight: 'calc(100vh - 360px)', overflow: 'auto' }}>
              <table
                className='border-collapse text-[13px]'
                style={{ width: '95%', margin: 'auto' }}
              >
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td
                        className={`${tdBase} text-left pl-0`}
                        style={{
                          width: '40%',
                          padding: '2.5% 0% 2%',
                          verticalAlign: 'top',
                        }}
                      >
                        <label className='text-[14px] font-semibold text-[#19191c]'>
                          {p.name}
                        </label>
                      </td>
                      <td
                        className={`${tdBase} text-right`}
                        style={{
                          width: '15%',
                          padding: '2.5% 0% 2%',
                          verticalAlign: 'top',
                        }}
                      >
                        {p.orderQuantity}{' '}
                        {p.orderQuantity === 1
                          ? p.purchaseUnit
                          : p.purchaseUnitPlural}
                      </td>
                      <td
                        className={`${tdBase} text-right`}
                        style={{
                          width: '20%',
                          padding: '2.5% 0% 2%',
                          verticalAlign: 'top',
                        }}
                      >
                        {formatTotal(p.pricePerPurchaseUnit, currency)}
                      </td>
                      <td
                        className={`${tdBase} text-right text-[13px]`}
                        style={{
                          width: '15%',
                          color: '#19191c',
                          fontWeight: '600',
                          padding: '2.5% 0.5% 2% 0%',
                          verticalAlign: 'top',
                        }}
                      >
                        {formatTotal(p.subtotal, currency)}
                      </td>
                      <td
                        className={`${tdBase}`}
                        style={{
                          width: '10%',
                          padding: '2.5% 0% 2%',
                          verticalAlign: 'top',
                        }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: 'calc(100vh - 360px)', overflow: 'auto' }}>
            {groups.map((group) => (
              <GroupedTable
                key={group.title}
                group={group}
                currency={currency}
                qualityIssueMap={qualityIssueMap}
              />
            ))}
          </div>
        )}
      </div>

      <EditOrderModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        order={{
          ...order,
          products,
          placedDate,
          scheduledDate,
          inventoryName,
          supplier: supplierName,
          number: orderNumber,
        }}
        inventories={inventories}
        suppliers={suppliersData}
        units={units}
        onSave={async (payload) => {
          try {
            const updatePayload = {
              number: payload.orderNumber,
              deliveryDate: `${payload.scheduledFor} 01:00:00`,
              requestDate: `${payload.orderedOn} 01:00:00`,
              receivedDate: null,
              inventoryId: payload.inventoryId ?? selectedInventory?.id,
              supplierId:
                suppliersData.find((s) => s.Name === payload.supplier)?.Id ??
                payload.supplier,
              currency: null,
              total: payload.items.reduce(
                (sum, item) => sum + (parseFloat(item.subtotal) || 0),
                0,
              ),
              source: 0,
              products: payload.items
                .filter((item) => item.name)
                .map((item) => ({
                  id: item.id ?? null,
                  name: item.name,
                  sku: item.sku ?? '',
                  brand: '',
                  orderQuantity: parseFloat(item.orderQuantity) || 0,
                  acceptedQuantity: parseFloat(item.orderQuantity) || 0,
                  pricePerPurchaseUnit:
                    parseFloat(item.pricePerPurchaseUnit) || 0,
                  pricePerStockTakingUnit: 0,
                  pricePerBaseUnit: 0,
                  subtotal: String(parseFloat(item.subtotal || 0).toFixed(2)),
                  purchaseUnitId: item.purchaseUnitId ?? null,
                  stockTakingUnitId: item.purchaseUnitId ?? null,
                  baseUnitId: null,
                  stockTakingQuantityPerPurchaseUnit: 1,
                  taxRate: '0',
                  vatRate: '',
                  notes: '',
                  checked: 0,
                  quantityIssueId: null,
                  qualityIssueId: null,
                })),
            };

            await updateOrder(order.id, updatePayload);
            queryClient.invalidateQueries({
              queryKey: ['order-detail', order.id],
            });
            queryClient.invalidateQueries({ queryKey: ['external-orders'] });
            setShowEditModal(false);
            setToastMessage({ type: 'update' });
            setTimeout(() => setToastMessage(null), 4000);
          } catch (err) {
            console.error('Failed to update order:', err);
          }

          setShowEditModal(false);
          setToastMessage({ type: 'update' });
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={EXTERNAL_ORDER_MODAL_TITLES.deleteOrderFromSupplier(
          orderNumber,
          supplierName,
        )}
        description='This action is irreversible and you will lose all the information related to this order.'
        confirmLabel='Delete order'
        cancelLabel='Cancel'
        onConfirm={handleDeleteOrder}
      />

      {toastMessage?.type === 'update' && (
        <div className='fixed bottom-0 right-0 z-50' style={{ left: '200px' }}>
          <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm'>
            The order has been updated.
          </div>
        </div>
      )}
    </div>
  );
}
