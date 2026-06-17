import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import ItemRow from './ItemRows';
import {
  fetchItemTemplates,
  fetchStoreProductsSearch,
} from '../../../services/manageItemTemplateService';
import { formatPrice } from '../../../utils/format';
import GreenButton from '../../Common/GreenButton';

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
}) {
  // const [checkedIds, setCheckedIds] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [isSorting, setIsSorting] = useState(false);
  // const selectedBarRef = useRef(null);
  // const [selectedBarHeight, setSelectedBarHeight] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '');
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // useEffect(() => {
  //   if (selectedBarRef.current) {
  //     setSelectedBarHeight(selectedBarRef.current.offsetHeight);
  //   }
  // }, [checkedIds.length]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'itemTemplates',
        debouncedSearch,
        filters?.categoryId || '',
        filters?.subcategoryId || '',
        filters?.inventoryId || '',
        filters?.supplierId || '',
      ],
      queryFn: ({ pageParam = 0 }) =>
        fetchItemTemplates({
          name: debouncedSearch,
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
    });

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const rawItems =
    data?.pages?.flatMap((page) => page?.Data || page?.data || []) || [];

  const items = (rawItems || []).map((p) => ({
    id: p.id,
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
          .map((inv) => inv.inventoryName)
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
            .map((inv) => inv.inventoryName)
        : [],
    })),
  }));

  const filteredItems = items.filter((item) => {
    if (!filters?.issue || filters.issue === 'All item templates') return true;
    if (filters.issue === 'Duplicate item templates') return item.isDuplicate;
    if (filters.issue === 'Item templates without SKU') return !item.sku;
    return true;
  });

  const sortedFilteredItems = sortKey
    ? [...filteredItems].sort((a, b) => {
        let aVal, bVal;

        if (
          sortKey === 'purchaseUnit' ||
          sortKey === 'stockTakingUnit' ||
          sortKey === 'basicMeasUnit'
        ) {
          aVal = a[sortKey]?.name ?? '';
          bVal = b[sortKey]?.name ?? '';
        } else if (sortKey === 'inStock') {
          aVal = a.inStock?.length ?? 0;
          bVal = b.inStock?.length ?? 0;
        } else if (sortKey === 'durabilityDays') {
          aVal = a.durabilityDays === '----' ? -1 : Number(a.durabilityDays);
          bVal = b.durabilityDays === '----' ? -1 : Number(b.durabilityDays);
        } else {
          aVal = a[sortKey];
          bVal = b[sortKey];
        }

        if (aVal == null || aVal === '') return 1;
        if (bVal == null || bVal === '') return -1;

        const cmp =
          typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filteredItems;

  const allChecked =
    filteredItems.length > 0 && checkedIds.length === filteredItems.length;

  function toggleAll() {
    onCheckedChange(allChecked ? [] : filteredItems.map((i) => i.id));
  }

  function toggleOne(id) {
    onCheckedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleSort(key) {
    setIsSorting(true);
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setTimeout(() => setIsSorting(false), 300);
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 min-h-0 overflow-y-auto'>
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
                <label
                  className='relative block cursor-pointer select-none'
                  style={{ paddingLeft: '20px', marginBottom: 0 }}
                >
                  <input
                    type='checkbox'
                    checked={allChecked}
                    onChange={toggleAll}
                    className='absolute opacity-0 cursor-pointer h-0 w-0'
                  />
                  <span
                    className={`absolute top-0 left-0 rounded h-5 w-5 border ${
                      allChecked
                        ? 'bg-[#23a956] border-[#23a956]'
                        : 'bg-white border-[#d7d7db]'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    {allChecked && (
                      <span
                        className='absolute border-white'
                        style={{
                          left: '7px',
                          top: '4px',
                          width: '4px',
                          height: '8px',
                          border: 'solid white',
                          borderWidth: '0 2px 2px 0',
                          transform: 'rotate(45deg)',
                          display: 'block',
                        }}
                      />
                    )}
                  </span>
                </label>
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
                          ? sortDir === 'asc'
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
            {isLoading || isSorting ? (
              <tr>
                <td
                  colSpan={10}
                  className='text-center py-10 text-sm text-[#6b6b6f]'
                >
                  Loading...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  {filters?.issue === 'Duplicate item templates' ? (
                    <div className='flex flex-col items-center justify-center text-center px-12 py-9 mt-20'>
                      <img
                        src='/img/empty-state-product-duplication.svg'
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
                        No duplicate item templates
                      </h4>
                      <GreenButton onClick={onClearIssueFilter}>
                        Clear the filter
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
                        You have no products
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
                        To import products in bulk, upload your past orders in
                        pdf, jpg or png format and we'll extract all the
                        products for you.
                      </p>
                      <GreenButton>
                        <img
                          src='/icons/upload.svg'
                          alt=''
                          className='w-4 h-4'
                        />
                        Upload an order to extract products
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
                />
              ))
            )}
          </tbody>
        </table>

        <div
          ref={loaderRef}
          className='py-4 text-center text-sm text-[#6b6b6f]'
        >
          {isFetchingNextPage ? 'Loading more...' : ''}
        </div>
      </div>
    </div>
  );
}
