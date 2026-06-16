import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
} from 'date-fns';

import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { formatPrice } from '../../../utils/format';
import {
  fetchTransferIn,
  fetchTransferOut,
  fetchTransferItems,
  fetchTransferItemInventories,
} from '../../../services/transfersTabService';
import ExportButton from '../common/ExportButton';
import MonthPicker from '../common/MonthPicker';
import TotalValueTransferredIn from './TotalValueTransferredIn';
import ItemsTransferredIn from './ItemsTransferredIn';
import TotalValueTransferredOut from './TotalValueTransferredOut';
import ItemsTransferredOut from './ItemsTransferredOut';
import TransferInformation from './TransferInformation';
import InformationTable from './InformationTable';

const SORT_KEY_MAP = {
  item: 'name',
  date: 'transferDate',
  transferredBy: 'transferredBy',
  inventory: 'involvedInventoryName',
  quantity: 'totalTransferredQty',
  value: 'totalTransferredValue',
};

const TRANSFER_TYPE_MAP = {
  all: '',
  in: '1',
  out: '2',
};

export default function TransfersTab() {
  const persisted = getPersistedDateRange('analytics_date_range_transfers');
  const [dateRange, setDateRange] = useState({
    fromDate:
      persisted?.fromDate ??
      format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    toDate:
      persisted?.toDate ??
      format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  });

  const [showAllValue, setShowAllValue] = useState('all');
  const [inventoryValue, setInventoryValue] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  // const [isTableLoading, setIsTableLoading] = useState(false);

  const prevQueryKeyRef = useRef(null);

  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);
  const enabled = !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate;

  // useEffect(() => {
  //   setIsTableLoading(true);
  // }, [inventoryId, dateRange, showAllValue, inventoryValue, sortKey, sortDir]);

  const { data: inData, isLoading: isInLoading } = useQuery({
    queryKey: ['transferIn', inventoryId, dateRange.fromDate, dateRange.toDate],
    queryFn: () =>
      fetchTransferIn({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: outData, isLoading: isOutLoading } = useQuery({
    queryKey: [
      'transferOut',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchTransferOut({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled,
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetching: isItemsLoading,
    isPending: isItemsPending,
  } = useInfiniteQuery({
    queryKey: [
      'transferItems',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
      showAllValue,
      inventoryValue,
      sortKey,
      sortDir,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchTransferItems({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        transferType: TRANSFER_TYPE_MAP[showAllValue],
        involvedInventoryIds: inventoryValue ?? '',
        sortBy: SORT_KEY_MAP[sortKey],
        sortOrder: sortDir.toUpperCase(),
        limit: 10,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p?.Data?.products ?? []).length;
      const count = lastPage?.Data?.products?.length ?? 0;
      return count < 10 ? undefined : loaded;
    },
    enabled,
    staleTime: 0,
    gcTime: 0,
  });

  const allRows = (itemsData?.pages ?? [])
    .flatMap((p) => p?.Data?.products ?? [])
    .map((p) => ({
      type: p.transferType === 1 ? 'in' : 'out',
      item: p.name,
      date: p.transferDate
        ? format(parseISO(p.transferDate), 'dd MMM yyyy')
        : '—',
      transferredBy: p.transferredBy,
      inventory: p.involvedInventoryName,
      quantity: `${p.totalTransferredQty} ${p.totalTransferredQty === 1 ? p.stockTakingUnit : p.stockTakingUnitPlural}`,
      value: formatPrice(p.totalTransferredValue),
    }));

  const queryKey = [
    inventoryId,
    dateRange,
    showAllValue,
    inventoryValue,
    sortKey,
    sortDir,
  ].join('|');
  const isFilterChange =
    prevQueryKeyRef.current !== null && prevQueryKeyRef.current !== queryKey;
  if (prevQueryKeyRef.current !== queryKey) {
    prevQueryKeyRef.current = queryKey;
  }
  const showTableSkeleton =
    isItemsLoading && (isFilterChange || allRows.length === 0);

  // useEffect(() => {
  //   if (itemsData !== undefined) {
  //     setIsTableLoading(false);
  //   }
  // }, [itemsData]);

  // useEffect(() => {
  //   if (!isItemsLoading) {
  //     setIsTableLoading(false);
  //   } else {
  //     setIsTableLoading(true);
  //   }
  // }, [isItemsLoading]);

  const inInfo = inData?.Data;
  const outInfo = outData?.Data;

  function mapInventories(inventories = []) {
    return inventories.map((inv) => ({
      ...inv,
      value: formatPrice(inv.value),
    }));
  }

  const isEmpty =
    !isInLoading &&
    !isOutLoading &&
    (!inInfo || inInfo.totalItems === 0) &&
    (!outInfo || outInfo.totalItems === 0);

  function handleDateApply({ startDate, endDate, label }) {
    setDateRange({ fromDate: startDate, toDate: endDate, label });
  }

  function toggleDropdown(name) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }
  return (
    <div
      style={{
        overflow: 'hidden auto',
        position: 'fixed',
        width: 'calc(100% - 200px)',
        height: 'calc(100% - 200px)',
        padding: '0px 35px 60px',
      }}
    >
      {/* Header */}
      <div className='flex justify-between items-center w-full py-9.5'>
        <span
          style={{
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            color: '#19191c',
          }}
        >
          Transfers
        </span>

        <div className='flex items-center gap-5'>
          <ExportButton disabled={isEmpty} />
          <MonthPicker
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            label={dateRange.label}
            onApply={handleDateApply}
            storageKey='analytics_date_range_transfers'
          />
        </div>
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <div className='h-125 w-full flex flex-col justify-center items-center'>
          <img
            src='/img/lemon.png'
            alt='no transfer'
            style={{ height: 108, width: 151 }}
          />
          <span className='font-semibold text-[24px] leading-8 tracking-[-0.01em] text-[#19191c] text-center mt-6'>
            No items transferred
          </span>
          <h3 className='text-[#97979b] text-center text-[16px] font-normal tracking-[-0.16px] mt-2'>
            There aren't any items transferred into or from this inventory yet.
          </h3>
        </div>
      ) : (
        <>
          {/* IN row */}
          <div className='flex'>
            <TotalValueTransferredIn
              totalValue={
                inInfo ? `${formatPrice(inInfo.transferredValue)}` : '0 kr'
              }
              itemCount={inInfo?.totalItems ?? 0}
              inventoryCount={inInfo?.totalInventories ?? 0}
              isLoading={isInLoading}
            />
            <ItemsTransferredIn
              inventories={mapInventories(inInfo?.inventories)}
              isLoading={isInLoading}
            />
          </div>

          {/* OUT row */}
          <div className='flex'>
            <TotalValueTransferredOut
              totalValue={
                outInfo ? `${formatPrice(outInfo.transferredValue)}` : '0 kr'
              }
              itemCount={outInfo?.totalItems ?? 0}
              inventoryCount={outInfo?.totalInventories ?? 0}
              isLoading={isOutLoading}
            />
            <ItemsTransferredOut
              inventories={mapInventories(outInfo?.inventories)}
              isLoading={isOutLoading}
            />
          </div>

          <TransferInformation
            inventoryId={inventoryId}
            dateRange={dateRange}
            showAllValue={showAllValue}
            onShowAllChange={setShowAllValue}
            inventoryValue={inventoryValue}
            onInventoryChange={setInventoryValue}
            openDropdown={openDropdown}
            onToggleDropdown={toggleDropdown}
          />

          <InformationTable
            rows={showTableSkeleton ? [] : allRows}
            isLoading={showTableSkeleton}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  );
}
