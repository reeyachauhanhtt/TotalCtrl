import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';

import {
  setInternalDetailOpen,
  setSelectedInternalOrder,
} from '../../store/internalOrderSlice';
import { fetchQualityIssues } from '../../services/masterDataService';
import {
  fetchInternalOrderDetail,
  deleteInternalOrder,
} from '../../services/internalOrderService';
import { InternalOrderDetailSkeleton } from '../Common/Skeleton';
import ConfirmModal from '../Common/ConfirmModal';
import EditInternalOrderModal from './EditInternalOrder';

const STATUS_LABEL_MAP = {
  scheduled: 'Scheduled',
  'partially-delivered': 'Partially Delivered',
  'partially delivered': 'Partially Delivered',
  delivered: 'Delivered',
};

function getStatusBadge(status) {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case 'scheduled':
      return { bg: '#e7e7ec', color: '#57575b' };

    case 'partially-delivered':
    case 'partially delivered':
      return { bg: '#fff4bd', color: '#a08700' };

    case 'delivered':
      return { bg: '#eaf7ee', color: '#0f6f36' };

    default:
      return { bg: '#e7e7ec', color: '#57575b' };
  }
}

function formatOrderedDate(dateStr, status) {
  if (!dateStr) return '———';
  if (status === 'Partially Delivered') {
    return format(new Date(dateStr), 'EEE dd MMM yyyy'); // "Tue 08 Apr 2025"
  }
  return format(new Date(dateStr), 'dd MMM yyyy'); // "08 Apr 2025"
}

function formatLastDeliveredDate(dateStr) {
  if (!dateStr) return '---';
  return format(new Date(dateStr), 'dd MMM yyyy (EEE)'); // "02 Oct 2025 (Thu)"
}

const TABLE_COLUMNS = [
  { label: 'SKU', align: 'left', width: '20%' },
  { label: 'Items', align: 'left', width: '50%' },
  { label: 'Quantity', align: 'right', width: '20%' },
  { label: '', align: 'right', width: '10%' },
];

function GroupedTable({ group, qualityIssueMap }) {
  return (
    <div>
      {/* Group header */}
      <h2
        style={{
          borderBottom: '1px solid #e6e6ed',
          borderTop: '1px solid #e6e6ed',
          backgroundColor: '#f8f9fa',
          padding: '15px 30px',
          color: '#000',
          fontWeight: 600,
          fontSize: '18px',
          margin: 0,
        }}
      >
        {group.title}
      </h2>

      {/* Each group has its own table */}
      <table
        className='border-collapse text-[13px] w-full'
        style={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            <th
              className='h-12 text-[12px] font-semibold! uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-left'
              style={{ width: '50%', paddingLeft: '30px' }}
            >
              Items
            </th>
            <th
              className='h-12 text-[12px] font-semibold! uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
              style={{ width: '40%' }}
            >
              Quantity
            </th>
            <th className='h-12 bg-[#f8f9fa]' style={{ width: '10%' }} />
          </tr>
        </thead>

        <tbody>
          {group.products.map((p) => {
            const qualityLabel = qualityIssueMap?.[p.qualityIssueId] ?? null;
            const issueText =
              [qualityLabel, p.otherIssueReason].filter(Boolean).join(' | ') ||
              null;
            const hasIssue = !!issueText;

            return (
              <>
                <tr key={p.id} style={{ height: '72px' }}>
                  {/* Item name */}
                  <td
                    className='text-left text-[14px] leading-4'
                    style={{
                      width: '50%',
                      paddingLeft: '30px',
                      borderBottom: hasIssue ? 'none' : '1px solid #e6e6ed',
                      color: '#19191c',
                      verticalAlign: 'middle',
                    }}
                  >
                    <label style={{ fontWeight: 600 }}>{p.name}</label>
                  </td>
                  {/* Quantity */}
                  <td
                    className='text-right text-[14px] leading-4'
                    style={{
                      width: '40%',
                      borderBottom: hasIssue ? 'none' : '1px solid #e6e6ed',
                      color: '#19191c',
                      verticalAlign: 'middle',
                      textAlign: 'right',
                    }}
                  >
                    {p.displayQuantity}{' '}
                    {p.displayQuantity === 1
                      ? p.units?.stockTaking?.singularShortcut
                      : p.units?.stockTaking?.pluralShortcut}
                  </td>
                  {/* Empty */}
                  <td
                    className='text-right'
                    style={{
                      width: '10%',
                      padding: '2.5% 0% 2%',
                      verticalAlign: 'top',
                      borderBottom: hasIssue ? 'none' : '1px solid #e6e6ed',
                    }}
                  />
                </tr>

                {/* Issue row */}
                {hasIssue && (
                  <tr key={`${p.id}-issue`} style={{ margin: 0 }}>
                    <td
                      colSpan={9}
                      style={{
                        paddingTop: 0,
                        paddingBottom: '24px',
                        borderBottom: '1px solid #e6e6ed',
                        height: 'auto',
                      }}
                    >
                      <div
                        style={{
                          width: '95.5%',
                          margin: '0 0 0 30px',
                          padding: '5px 0',
                        }}
                      >
                        <div
                          style={{
                            background: '#fff0f1',
                            color: '#a71a23',
                            fontWeight: '800',
                            fontSize: '14px',
                            lineHeight: '18px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <img
                            src='/icons/error.svg'
                            alt=''
                            style={{ marginLeft: '18px', width: '20px' }}
                          />
                          <label style={{ margin: '9px' }}>{issueText}</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function InternalOrderDetail({ order }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleBack() {
    queryClient.removeQueries({
      queryKey: ['internal-order-detail', order.id],
    });
    dispatch(setInternalDetailOpen(false));
    dispatch(setSelectedInternalOrder(null));
  }
  const { data: qualityIssuesData } = useQuery({
    queryKey: ['quality-issues'],
    queryFn: fetchQualityIssues,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const qualityIssueMap = Object.fromEntries(
    (qualityIssuesData?.Data ?? []).map((q) => [q.id, q.translatedName]),
  );

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['internal-order-detail', order.id],
    queryFn: () => fetchInternalOrderDetail(order.id),
    enabled: !!order.id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteInternalOrder(order.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-order'] });
      handleBack();
    },
    onError: (err) => console.error('Delete error:', err),
  });

  const detail = data?.Data;

  const statusRaw = detail?.status ?? order.status ?? '';
  const status = STATUS_LABEL_MAP[statusRaw] ?? statusRaw;
  const { bg, color } = getStatusBadge(status);

  const isScheduled = status === 'Scheduled';

  const fromInventoryName =
    detail?.fromInventory?.name ?? order.fromInventory?.name ?? '—';
  const toInventoryName =
    detail?.toInventory?.name ?? order.toInventory?.name ?? '—';
  const orderNumber = detail?.orderNumber ?? order.orderNumber ?? '—';
  const orderedAt = detail?.orderedAt ?? order.orderedAt;
  const lastDeliveredAt = detail?.lastDeliveredAt ?? order.lastDeliveredAt;
  const totalItems = detail?.totalItems ?? order.totalItems ?? 0;
  const groups = detail?.data ?? [];

  const isLoadingAny = isLoading || isFetching;

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (isLoadingAny) {
    if (typeof InternalOrderDetailSkeleton !== 'undefined') {
      return <InternalOrderDetailSkeleton />;
    }
    return (
      <div className='flex flex-col flex-1 h-full overflow-hidden'>
        <div className='flex-1 overflow-auto'>
          <div style={{ width: '95%', margin: '40px auto 24px' }}>
            <div className='animate-pulse space-y-3'>
              <div className='h-8 bg-gray-200 rounded w-1/3' />
              <div className='h-4 bg-gray-200 rounded w-1/4' />
              <div className='flex gap-6 mt-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='space-y-1'>
                    <div className='h-3 bg-gray-200 rounded w-16' />
                    <div className='h-5 bg-gray-200 rounded w-20' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {fromInventoryName} To {toInventoryName}
              </h2>
              <label
                style={{ backgroundColor: bg, color, marginTop: '-3px' }}
                className='inline-block text-[11px] font-bold uppercase tracking-[0.08em] leading-4 px-2 py-0.5 rounded whitespace-nowrap'
              >
                {status}
              </label>
            </div>

            {/* Order number */}
            <div
              className='text-[16px] text-black'
              style={{ marginBottom: '25px' }}
            >
              #{orderNumber}
            </div>

            {/* Stats — Ordered | Last Delivered | Items */}
            <div className='flex items-center'>
              {[
                {
                  label: 'Ordered',
                  value: formatOrderedDate(orderedAt, status),
                },
                {
                  label: 'Last Delivered',
                  value: formatLastDeliveredDate(lastDeliveredAt),
                },
                { label: 'Items', value: totalItems, last: true },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'inline-block',
                    borderRight: stat.last ? 'none' : '1px solid #d7d7db',
                    paddingRight: stat.last ? '0' : '20px',
                    paddingLeft: idx === 0 ? '0' : '24px',
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
                    {stat.value}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Actions (edit + more) — always visible for now, wire later */}
          {isScheduled && (
            <div className='flex items-start justify-end gap-1'>
              <button
                onClick={() => setShowEditModal(true)}
                className='w-12 h-12 flex items-center justify-center rounded-full border border-transparent bg-transparent cursor-pointer hover:bg-[#dcf1e3] transition'
              >
                <img src='/icons/dark-edit.svg' alt='edit' />
              </button>
              <div className='relative'>
                <button
                  onClick={() => setShowDropdown((p) => !p)}
                  className='w-12 h-12 flex items-center justify-center rounded-full border border-transparent bg-transparent cursor-pointer hover:bg-[#dcf1e3] transition'
                >
                  <img src='/icons/dark-more.svg' alt='more' />
                </button>
                {showDropdown && (
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

        {/* Table  */}
        {isError ? (
          <div className='text-center text-red-500 text-sm py-16'>
            Failed to load order details.
          </div>
        ) : (
          <>
            {/* Sticky header */}
            {isScheduled && (
              <div
                style={{
                  borderBottom: '1px solid #e6e6ed',
                  borderTop: '1px solid #e6e6ed',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <table
                  className='border-collapse text-[13px]'
                  style={{ width: '95%', margin: 'auto' }}
                >
                  <thead>
                    <tr>
                      {TABLE_COLUMNS.map((col, i) => (
                        <th
                          key={i}
                          style={{ width: col.width, textAlign: col.align }}
                          className='h-12 text-[12px] font-semibold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa]'
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            )}

            {/* Scrollable body */}
            <div style={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
              {groups.map((group, index) =>
                groups.length === 1 && group.slug === 'not-delivered' ? (
                  <table
                    key={group.slug}
                    className='border-collapse text-[13px]'
                    style={{ width: '95%', margin: 'auto' }}
                  >
                    <tbody>
                      {group.products.map((p) => (
                        <tr key={p.id}>
                          {/* SKU */}
                          <td
                            className='border-b border-[#e6e6ed] align-top text-left'
                            style={{
                              width: '20%',
                              padding: '2.5% 0% 2%',
                              verticalAlign: 'top',
                              height: '72px',
                              fontSize: '14px',
                              lineHeight: '16px',
                            }}
                          >
                            <label
                              style={{
                                color: '#19191c',
                                fontWeight: 600,
                              }}
                            >
                              {p.sku || '---'}
                            </label>
                          </td>
                          {/* Item name */}
                          <td
                            className='border-b border-[#e6e6ed] align-top text-left'
                            style={{
                              width: '50%',
                              padding: '2.5% 0% 2%',
                              verticalAlign: 'top',
                              height: '72px',
                              fontSize: '14px',
                              lineHeight: '16px',
                            }}
                          >
                            <label
                              style={{ color: '#19191c', fontWeight: 600 }}
                            >
                              {p.name}
                            </label>
                          </td>
                          {/* Quantity */}
                          <td
                            className='border-b border-[#e6e6ed] align-top text-right'
                            style={{
                              width: '20%',
                              padding: '2.5% 0.8% 2% 0%',
                              verticalAlign: 'top',
                              height: '72px',
                              fontSize: '14px',
                              lineHeight: '16px',
                              color: '#19191c',
                            }}
                          >
                            {p.displayQuantity}{' '}
                            {p.displayQuantity === 1
                              ? p.units?.stockTaking?.singularShortcut
                              : p.units?.stockTaking?.pluralShortcut}
                          </td>
                          {/* empty action col */}
                          <td
                            className='border-b border-[#e6e6ed] align-top text-right'
                            style={{
                              width: '10%',
                              padding: '2.5% 0% 2%',
                              verticalAlign: 'top',
                              height: '72px',
                            }}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <GroupedTable
                    key={`${group.slug}-${index}`}
                    group={group}
                    qualityIssueMap={qualityIssueMap}
                  />
                ),
              )}
            </div>
          </>
        )}
      </div>

      <EditInternalOrderModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowUpdateToast(true);
          setTimeout(() => setShowUpdateToast(false), 4500);
        }}
        order={order}
        detail={detail}
      />

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Delete order # ${orderNumber} from ${fromInventoryName} ?`}
        description='This action is irreversible and you will lose all the information related to this order.'
        confirmLabel='Delete Order'
        cancelLabel='Cancel'
        onConfirm={() => deleteMutation.mutate()}
      />

      {showUpdateToast && (
        <div
          className='fixed bottom-6 z-50'
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <div
            className='flex items-center gap-3 bg-[#19191c] leading-6 px-6 py-4 rounded-lg'
            style={{ whiteSpace: 'nowrap' }}
          >
            <div className='w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0'>
              <svg
                width='10'
                height='10'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#22c55e'
                strokeWidth='3'
              >
                <path d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <button
              onClick={() => setShowUpdateToast(false)}
              className='text-white opacity-100 ml-2'
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
