import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import ItemRow from './ItemRows';
import { SkeletonBar } from '../../Common/Skeleton';
import { fetchItemTemplates } from '../../../services/manageItemTemplateService';
import { formatPrice } from '../../../utils/format';
import GreenButton from '../../Common/GreenButton';
import Checkbox from '../../Common/Checkbox';
import {
  ITEM_TEMPLATE_SORT_KEYS,
  ITEM_TEMPLATE_UNIT_SORT_KEYS,
  SORT_DIRECTIONS,
} from '../../../constants/sortKeys';
import { EMPTY_STATE_LABELS, BUTTON_LABELS } from '../../../constants/titles';

const HEADERS = [
  {
    label: 'Item name',
    key: 'name',
    active: true,
    minWidth: '300px',
    width: '38%',
  },
  { label: 'SKU', key: 'sku', center: true, width: '8%' },
  {
    label: 'Purchase Unit',
    key: 'purchaseUnit',
    width: '7%',
    minWidth: '60px',
  },
  { label: 'Stocktaking Unit', key: 'stockTakingUnit', width: '7%' },
  {
    label: 'Basic Meas. Unit',
    key: 'basicMeasUnit',
    width: '7%',
    minWidth: '70px',
  },
  {
    label: 'Category And Subcategory',
    key: 'category',
    width: '12%',
    minWidth: '85px',
  },
  { label: 'Durability Days', key: 'durabilityDays', width: '8%' },
  { label: 'In Stock', key: 'inStock', width: '15%', minWidth: '150px' },
];

export default function ItemTable({
  search,
  filters,
  onClearIssueFilter,
  checkedIds,
  onCheckedChange,
  onItemEdited,
  onItemDeleted,
  onItemAdded,
  onDuplicateCountChange,
  onUploadClick,
}) {
  const [sortKey, setSortKey] = useState(ITEM_TEMPLATE_SORT_KEYS.NAME);
  const [sortDir, setSortDir] = useState(SORT_DIRECTIONS.DESC);
  const [isSorting, setIsSorting] = useState(false);
  const [prevIssue, setPrevIssue] = useState(filters?.issue);
  const [isFilteringIssue, setIsFilteringIssue] = useState(false);

  useEffect(() => {
    if (filters?.issue !== prevIssue) {
      setPrevIssue(filters?.issue);
      setIsFilteringIssue(true);
      const t = setTimeout(() => setIsFilteringIssue(false), 900);
      return () => clearTimeout(t);
    }
  }, [filters?.issue]);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'itemTemplates',
      search,
      filters?.categoryId || '',
      filters?.subcategoryId || '',
      filters?.inventoryId || '',
      filters?.supplierId || '',
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchItemTemplates({
        name: search,
        parentProductGroupId: filters?.categoryId || '',
        productGroupId: filters?.subcategoryId || '',
        inventoryId: filters?.inventoryId || '',
        supplierId: filters?.supplierId || '',
        offset: pageParam,
        limit: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * 20;
      return loaded < (lastPage?.total || 0) ? loaded : undefined;
    },
    staleTime: 0,
  });

  const scrollRef = useRef(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 150) {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }
  };

  const rawItems =
    data?.pages?.flatMap((page) => page?.Data || page?.data || []) || [];

  // console.log(
  //   'Total items:',
  //   rawItems.length,
  //   'Duplicates:',
  //   rawItems.filter((p) => p.isDuplicate).length,
  // );

  const items = (rawItems || []).map((p) => ({
    id: p.id,
    productGroup: p.productGroup,
    purchaseUnitId: p.purchaseUnitId,
    stockTakingUnitId: p.stockTakingUnitId,
    baseMeasurementUnitId: p.baseMeasurementUnitId,
    stockTakingQuantityPerPurchaseUnit: p.stockTakingQuantityPerPurchaseUnit,
    stockTakingQuantityPerBaseMeasurementUnit:
      p.stockTakingQuantityPerBaseMeasurementUnit,
    subparLevel: p.subparLevel,
    pricePerPurchaseUnit: p.pricePerPurchaseUnit,
    pricePerStockTakingUnit: p.pricePerStockTakingUnit,
    pricePerBaseUnit: p.pricePerBaseUnit,
    costUnit: p.costUnit, // 'PU', 'SU', or 'BMU'
    stockTakingUnit: p.stockTakingUnit,
    pricePerStockTakingUnit: p.pricePerStockTakingUnit,
    inventoryQuantities: p.inventoryQuantities,
    name: p.name,
    sku: p.sku || '',
    purchaseUnit: p.purchaseUnit
      ? {
          name: p.purchaseUnit,
          price: p.pricePerPurchaseUnit
            ? `${formatPrice(p.pricePerPurchaseUnit)}`
            : null,
        }
      : null,
    stockTakingUnit: p.stockTakingUnit
      ? {
          name: p.stockTakingUnit,
          price: p.pricePerStockTakingUnit
            ? `${formatPrice(p.pricePerStockTakingUnit)}`
            : null,
        }
      : null,
    basicMeasUnit: p.baseMeasurementUnit
      ? {
          name: p.baseMeasurementUnit,
          price: p.pricePerBaseUnit
            ? `${formatPrice(p.pricePerBaseUnit)}`
            : null,
        }
      : null,
    category: p.productGroup?.parent?.name || p.productGroup?.name || '',
    subcategory: p.productGroup?.parent ? p.productGroup.name : '',
    durabilityDays: p.durabilityDays || '----',

    inStock: Array.isArray(p.inventoryQuantities)
      ? p.inventoryQuantities
          .filter((inv) => inv.totalQuantity > 0)
          .map((inv) => ({ id: inv.inventoryId, name: inv.inventoryName }))
      : [],
    isDuplicate: p.isDuplicate || false,
    duplicateProducts: (p.duplicateProducts || []).map((dup) => ({
      id: dup.id,
      name: dup.name,
      sku: dup.sku || '',
      purchaseUnit: dup.purchaseUnit || '',
      stockTakingUnit: dup.stockTakingUnit || '',
      category: dup.productGroup?.parent?.name || dup.productGroup?.name || '',
      inStock: Array.isArray(dup.inventoryQuantities)
        ? dup.inventoryQuantities
            .filter((inv) => inv.totalQuantity > 0)
            .map((inv) => ({ id: inv.inventoryId, name: inv.inventoryName }))
        : [],
    })),
  }));

  useEffect(() => {
    const count = data?.pages?.[0]?.noOfDuplicateRecords ?? 0;
    onDuplicateCountChange?.(count);
  }, [data?.pages?.[0]?.noOfDuplicateRecords]);

  const filteredItems = items.filter((item) => {
    if (!filters?.issue || filters.issue === 'All item templates') return true;
    if (filters.issue === 'Duplicate item templates') return item.isDuplicate;
    if (filters.issue === 'Item templates without SKU') return !item.sku;
    return true;
  });

  const sortedFilteredItems = sortKey
    ? [...filteredItems].sort((a, b) => {
        let aVal, bVal;

        if (ITEM_TEMPLATE_UNIT_SORT_KEYS.includes(sortKey)) {
          aVal = a[sortKey]?.name ?? '';
          bVal = b[sortKey]?.name ?? '';
        } else if (sortKey === ITEM_TEMPLATE_SORT_KEYS.IN_STOCK) {
          aVal = a.inStock?.length ?? 0;
          bVal = b.inStock?.length ?? 0;
        } else if (sortKey === ITEM_TEMPLATE_SORT_KEYS.DURABILITY_DAYS) {
          aVal = a.durabilityDays === '----' ? -1 : Number(a.durabilityDays);
          bVal = b.durabilityDays === '----' ? -1 : Number(b.durabilityDays);
        } else if (sortKey === ITEM_TEMPLATE_SORT_KEYS.SKU) {
          const aEmpty = !a.sku;
          const bEmpty = !b.sku;
          if (aEmpty && bEmpty) return 0;
          if (aEmpty) return sortDir === SORT_DIRECTIONS.ASC ? -1 : 1;
          if (bEmpty) return sortDir === SORT_DIRECTIONS.ASC ? 1 : -1;

          const aIsNum = !isNaN(Number(a.sku));
          const bIsNum = !isNaN(Number(b.sku));

          // alpha before numeric
          if (!aIsNum && bIsNum)
            return sortDir === SORT_DIRECTIONS.ASC ? -1 : 1;
          if (aIsNum && !bIsNum)
            return sortDir === SORT_DIRECTIONS.ASC ? 1 : -1;

          if (aIsNum && bIsNum) {
            const cmp = Number(a.sku) - Number(b.sku);
            return sortDir === 'asc' ? cmp : -cmp;
          }

          const cmp = a.sku.localeCompare(b.sku);
          return sortDir === 'asc' ? cmp : -cmp;
        } else {
          aVal = a[sortKey];
          bVal = b[sortKey];
        }

        // For non-SKU cols: empty first on asc, empty last on desc
        const aEmpty = aVal == null || aVal === '' || aVal === '----';
        const bEmpty = bVal == null || bVal === '' || bVal === '----';
        if (aEmpty && bEmpty) return 0;
        if (aEmpty) return sortDir === SORT_DIRECTIONS.ASC ? -1 : 1;
        if (bEmpty) return sortDir === SORT_DIRECTIONS.ASC ? 1 : -1;

        const cmp =
          typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filteredItems;

  const allSelectableIds = filteredItems.flatMap((item) => [
    item.id,
    ...(item.duplicateProducts || []).map((d) => d.id),
  ]);

  const allChecked =
    allSelectableIds.length > 0 &&
    allSelectableIds.every((id) => checkedIds.includes(id));

  function toggleAll() {
    onCheckedChange(allChecked ? [] : allSelectableIds);
  }

  function toggleOne(id) {
    onCheckedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleSort(key) {
    setIsSorting(true);
    if (sortKey === key) {
      setSortDir((prev) =>
        prev === SORT_DIRECTIONS.ASC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC,
      );
    } else {
      setSortKey(key);
      setSortDir(SORT_DIRECTIONS.ASC);
    }
    setTimeout(() => setIsSorting(false), 300);
  }

  // console.log('Page 0 raw:', data?.pages?.[0]);

  return (
    <div className='flex flex-col h-full'>
      <div
        ref={scrollRef}
        className='flex-1 min-h-0 overflow-y-auto'
        onScroll={handleScroll}
      >
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-[#fbfbfc]'>
              {/* Checkbox */}
              <th
                className='sticky z-20 text-left align-top border-t border-b border-[#e7e7ec] bg-[#fbfbfc] pl-8'
                style={{
                  top: '-1px',
                  minWidth: '62px',
                  height: '64px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                }}
              >
                <Checkbox checked={allChecked} onChange={toggleAll} />
              </th>

              {HEADERS.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className={`sticky z-20 align-top border-t border-b border-[#e7e7ec] bg-[#fbfbfc] cursor-pointer pl-[10px] pr-3 ${h.center ? 'text-center' : 'text-left'}`}
                  style={{
                    top: '-1px',
                    height: '64px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    letterSpacing: '0.88px',
                    textTransform: 'uppercase',
                    width: h.width,
                    minWidth: h.minWidth,
                    color: sortKey === h.key ? '#23a956' : '#6b6b6f',
                  }}
                >
                  <span className='flex items-start gap-2'>
                    <span>{h.label}</span>
                    <img
                      src={
                        sortKey === h.key
                          ? sortDir === 'desc'
                            ? '/icons/asc-order-inv-green.svg'
                            : '/icons/desc-order-inv-green.svg'
                          : '/icons/desc-order.svg'
                      }
                      alt=''
                      className='mt-0.5 inline-block align-middle'
                    />
                  </span>
                </th>
              ))}

              {/* Empty last col */}
              <th
                className='sticky z-20 bg-[#fbfbfc] border-t border-b border-[#e7e7ec] pr-8'
                style={{ top: '-1px', height: '64px' }}
              />
            </tr>
          </thead>
          <tbody>
            {isLoading ||
            (isFetching && !isFetchingNextPage) ||
            isSorting ||
            isFilteringIssue ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className='border-b border-[#e6e6ed]'>
                  <td
                    className='pt-[26px] pb-[26px] pl-8'
                    style={{ minWidth: '62px' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 20, borderRadius: 4 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '38%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 220, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '8%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 50, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '12%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 90, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '8%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 50, borderRadius: 20 }}
                    />
                  </td>

                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '15%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 100, borderRadius: 20 }}
                    />
                  </td>
                  <td className='pt-[26px] pb-[26px] pr-8' />
                </tr>
              ))
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  {filters?.issue === 'Duplicate item templates' ? (
                    <div className='flex flex-col items-center justify-center text-center px-12 py-9 mt-20'>
                      <img
                        src='/icons/empty-state-product-duplication.svg'
                        height={108}
                        width={151}
                        alt=''
                        className='align-middle'
                      />
                      <h4
                        className='font-semibold text-center mt-5 mb-10'
                        style={{
                          fontSize: '24px',
                          lineHeight: '32px',
                          letterSpacing: '-0.01em',
                          color: '#19191c',
                        }}
                      >
                        {EMPTY_STATE_LABELS.NO_DUPLICATE_ITEM_TEMPLATES}
                      </h4>
                      <GreenButton onClick={onClearIssueFilter}>
                        {BUTTON_LABELS.CLEAR_THE_FILTER}
                      </GreenButton>
                    </div>
                  ) : (
                    <div
                      className='flex flex-col items-center text-center px-12'
                      style={{ marginTop: '48px', paddingTop: '0px' }}
                    >
                      <h4
                        style={{
                          fontSize: '24px',
                          lineHeight: '32px',
                          color: '#333',
                          fontWeight: '600',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {EMPTY_STATE_LABELS.NO_PRODUCTS}
                      </h4>
                      <p
                        className='text-left'
                        style={{
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: '#737373',
                          width: '357px',
                          marginBottom: '40px',
                          marginTop: '12px',
                        }}
                      >
                        {EMPTY_STATE_LABELS.NO_PRODUCTS_DESC}
                      </p>
                      <GreenButton onClick={onUploadClick}>
                        <img
                          src='/icons/upload.svg'
                          alt=''
                          className='w-4 h-4'
                        />
                        {BUTTON_LABELS.UPLOAD_ORDER_TO_EXTRACT_PRODUCTS}
                      </GreenButton>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              sortedFilteredItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  checked={checkedIds.includes(item.id)}
                  onToggle={() => toggleOne(item.id)}
                  checkedIds={checkedIds}
                  onDupToggle={toggleOne}
                  onItemEdited={onItemEdited}
                  onItemDeleted={onItemDeleted}
                  onItemAdded={onItemAdded}
                />
              ))
            )}

            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr
                  key={`skeleton-next-${i}`}
                  className='border-b border-[#e6e6ed]'
                >
                  <td
                    className='pt-[26px] pb-[26px] pl-8'
                    style={{ minWidth: '62px' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 20, borderRadius: 4 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '38%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 220, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '8%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 50, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '7%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 60, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '12%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 90, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '8%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 50, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='pt-[26px] pb-[26px] pl-[10px]'
                    style={{ width: '15%' }}
                  >
                    <SkeletonBar
                      style={{ height: 16, width: 100, borderRadius: 20 }}
                    />
                  </td>
                  <td className='pt-[26px] pb-[26px] pr-8' />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
