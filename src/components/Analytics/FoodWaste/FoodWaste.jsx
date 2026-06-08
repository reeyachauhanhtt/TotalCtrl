import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import ExportButton from '../common/ExportButton';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { formatPrice } from '../../../utils/format';
import FoodWasteDetailView from './FoodWasteDetailView';
import TotalValueOfWastedFood from './TotalValueOfWastedFood';
import FoodWasteByCause from './FoodWasteByCause';
import MostWastedItems from './MostWastedItems';
import FoodWasteByCategory from './FoodWasteByCategory';
import OverviewOfWastedFood from './OverviewOfWastedFood';
import {
  fetchTotalFoodWaste,
  fetchFoodWasteByCategory,
  fetchMostWastedItems,
  fetchFoodWasteByCause,
} from '../../../services/foodWasteService';

const SLUG_KEY_MAP = {
  WASTE_EXPIRATION: 'expiration',
  WASTE_BAD_QUALITY: 'bad_quality',
  WASTE_DAMAGED: 'damaged',
  WASTE_OTHER: 'other_reason',
};

export default function FoodWaste({ inventoryId }) {
  const persisted = getPersistedDateRange();
  const [dateRange, setDateRange] = useState(persisted);
  const [detailView, setDetailView] = useState(null); // null | 'items' | 'categories'

  // TOTAL WASTE VALUE QUERY
  const { data: totalWasteData } = useQuery({
    queryKey: ['foodWaste-total', inventoryId, dateRange],
    queryFn: () =>
      fetchTotalFoodWaste({
        inventoryId,
        fromDate:
          dateRange.fromDate ?? format(dateRange.startDate, 'yyyy-MM-dd'),
        toDate: dateRange.toDate ?? format(dateRange.endDate, 'yyyy-MM-dd'),
      }),
    enabled: !!inventoryId && !!(dateRange.fromDate || dateRange.startDate),
    select: (res) => res.Data,
  });

  const wasteEntry = totalWasteData?.foodWaste?.[0];

  // WASTE BY CAUSE QUERY
  const { data: causeData } = useQuery({
    queryKey: ['foodWaste-cause', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodWasteByCause({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate,
    select: (res) => res.Data,
  });

  const causes = (causeData?.cause ?? []).map((c) => ({
    key: SLUG_KEY_MAP[c.slug],
    percent: c.foodWastePercentage,
    value: c.foodWasteValue,
    otherReasons: c.otherReasons ?? [],
  }));

  // WASTE BY CATEGORY QUERY
  const { data: categoryData } = useQuery({
    queryKey: ['foodWaste-category', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodWasteByCategory({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 4,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate,
    select: (res) => res.Data,
  });

  const categories = (categoryData?.categories ?? []).map((c) => ({
    name: c.name,
    percent: c.totalWastePercentage,
    value: c.totalWasteValue,
  }));

  // MOST WASTED ITEMS QUERY
  const { data: mostWastedData } = useQuery({
    queryKey: ['foodWaste-most-wasted', inventoryId, dateRange],
    queryFn: () =>
      fetchMostWastedItems({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 4,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate,
    select: (res) => res.Data,
  });

  const items = (mostWastedData?.products ?? []).map((p) => ({
    name: p.name,
    quantity: p.totalWasteQty,
    unit: p.stockTakingUnitPlural,
    value: p.totalWasteValue,
  }));

  // DETAIL - ALL WASTED ITEMS
  const { data: allItemsData } = useQuery({
    queryKey: ['foodWaste-all-items', inventoryId, dateRange],
    queryFn: () =>
      fetchMostWastedItems({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 5,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && detailView === 'items',
    select: (res) => res.Data,
  });

  // DETAIL - ALL CATEGORIES
  const { data: allCategoryData } = useQuery({
    queryKey: ['foodWaste-all-categories', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodWasteByCategory({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 10,
      }),
    enabled:
      !!inventoryId && !!dateRange.fromDate && detailView === 'categories',
    select: (res) => res.Data,
  });

  // DETAIL VIEW ROWS
  const itemRows = (allItemsData?.products ?? []).map((p) => ({
    col1: p.name,
    col2: `${p.totalWasteQty} ${p.stockTakingUnitPlural}`,
    col3: formatPrice(p.totalWasteValue),
  }));

  const categoryRows = (allCategoryData?.categories ?? []).map((c) => ({
    col1: c.name,
    col2: formatPrice(c.totalWasteValue),
    col3: `${c.totalWastePercentage?.toFixed(2)}%`,
  }));

  function handleApply({ startDate, endDate }) {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
    });
  }

  function handleExport() {}

  if (detailView) {
    return (
      <FoodWasteDetailView
        type={detailView}
        onBack={() => setDetailView(null)}
        rows={detailView === 'items' ? itemRows : categoryRows}
      />
    );
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
      <div
        className='flex justify-between items-center w-full'
        style={{ padding: '38px 0' }}
      >
        <span
          className='font-semibold text-[#19191c]'
          style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}
        >
          Food Waste
        </span>
        <div className='flex items-center'>
          <ExportButton onClick={handleExport} />
          <div style={{ marginLeft: 20 }}>
            <MonthPicker onApply={handleApply} />
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div className='flex'>
        <TotalValueOfWastedFood
          totalValue={wasteEntry?.totalWasteValue ?? 0}
          percent={wasteEntry?.totalWastePercentage ?? 0}
        />
        <FoodWasteByCause
          causes={causes}
          inventoryId={inventoryId}
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
        />
      </div>

      {/* Row 2 */}
      <div className='flex' style={{ marginTop: 60 }}>
        <MostWastedItems items={items} />
        <FoodWasteByCategory categories={categories} />
      </div>

      {/* See all row */}
      <div className='flex'>
        <div className='flex items-end' style={{ width: '50%', height: 63 }}>
          <label
            className='flex items-center cursor-pointer text-[#1f8e4e]'
            style={{
              width: 150,
              height: 36,
              paddingTop: 7,
              fontSize: 14,
              fontWeight: 600,
            }}
            onClick={() => setDetailView('items')}
          >
            See all wasted items
            <img
              src='/img/download.png'
              alt=''
              height={10}
              width={6}
              className='ml-2'
            />
          </label>
        </div>
        <div className='flex items-end' style={{ width: '50%', height: 63 }}>
          <label
            className='flex items-center cursor-pointer text-[#1f8e4e]'
            style={{
              width: 150,
              height: 36,
              paddingTop: 7,
              fontSize: 14,
              fontWeight: 600,
            }}
            onClick={() => setDetailView('categories')}
          >
            See all categories
            <img
              src='/img/download.png'
              alt=''
              height={10}
              width={6}
              className='ml-2'
            />
          </label>
        </div>
      </div>

      {/* Overview */}
      <OverviewOfWastedFood inventoryId={inventoryId} />
    </div>
  );
}
