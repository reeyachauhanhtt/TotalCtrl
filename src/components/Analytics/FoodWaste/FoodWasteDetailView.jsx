import { useState } from 'react';

import MonthPicker from '../common/MonthPicker';
import ExportButton from '../common/ExportButton';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function FoodWasteDetailView({
  type,
  onBack,
  rows,
  isLoading = false,
  onDateApply,
  fetchNextPage,
  hasNextPage,
}) {
  const persisted = getPersistedDateRange(
    'analytics_date_range_food_waste_detail',
  );

  const isItems = type === 'items';

  const title = isItems ? 'Top most wasted items' : 'Food waste by category';

  const headers = isItems
    ? ['ITEM NAME', 'AMOUNT', 'VALUE']
    : ['CATEGORY', 'VALUE', 'INVENTORY %'];

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
      {/* Back nav */}
      <div
        className='flex items-center'
        style={{ height: 72, width: '100%', borderBottom: '1px solid #e6e6ed' }}
      >
        <div
          className='flex items-center flex-row cursor-pointer'
          style={{ height: 40, width: 240 }}
          onClick={onBack}
        >
          <img
            src='/img/greaterthan.png'
            alt='back'
            style={{ height: 24, width: 24 }}
          />
          <span
            className='font-semibold text-[#1f8e4e]'
            style={{
              fontSize: 14,
              lineHeight: '24px',
              marginLeft: 8,
            }}
          >
            Back to full report of Food Waste
          </span>
        </div>
      </div>

      {/* Header row */}
      <div
        className='flex justify-between items-center w-full'
        style={{ padding: '38px 0' }}
      >
        <span
          className='font-semibold text-[#19191c]'
          style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
        <div className='flex items-center'>
          <ExportButton onClick={() => {}} />
          <div style={{ marginLeft: 20 }}>
            <MonthPicker
              onApply={onDateApply}
              storageKey='analytics_date_range_food_waste_detail'
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className='overflow-hidden bg-white'
        style={{
          border: '1px solid #e7e7ec',
          boxShadow:
            '0 2px 4px rgba(51,51,82,0.08), 0 2px 6px rgba(51,51,82,0.08)',
          borderRadius: 8,
          marginTop: 0,
        }}
      >
        {/* Table header */}
        <div
          style={{
            borderBottom: '1px solid #e6e6ed',
            borderTop: '1px solid #e6e6ed',
            backgroundColor: '#f8f9fa',
          }}
        >
          <table
            className='border-collapse'
            style={{ width: '95%', margin: 'auto' }}
          >
            <thead>
              <tr>
                <th
                  className='text-left text-[#737373]'
                  style={{
                    width: '60%',
                    height: 48,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    paddingLeft: 0,
                  }}
                >
                  {headers[0]}
                </th>
                <th
                  className='text-right text-[#737373]'
                  style={{
                    width: '20%',
                    height: 48,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  {headers[1]}
                </th>
                <th
                  className='text-right text-[#737373]'
                  style={{
                    width: '20%',
                    height: 48,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    paddingRight: 0,
                  }}
                >
                  {headers[2]}
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table body */}
        <div style={{ height: 500, overflow: 'auto' }}>
          <table
            className='border-collapse'
            style={{ width: '95%', margin: 'auto' }}
          >
            <tbody>
              {isLoading
                ? Array.from({ length: 1 }).map((_, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          width: '60%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          paddingLeft: 0,
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <SkeletonBar
                          style={{ height: 16, width: 600, borderRadius: 20 }}
                        />
                      </td>
                      <td
                        style={{
                          width: '20%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <div className='flex justify-end'>
                          <SkeletonBar
                            style={{ height: 16, width: 100, borderRadius: 20 }}
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          width: '20%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          paddingRight: 0,
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <div className='flex justify-end'>
                          <SkeletonBar
                            style={{ height: 16, width: 80, borderRadius: 20 }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                : (rows ?? []).map((row, i) => (
                    <tr key={i}>
                      <td
                        className='text-left'
                        style={{
                          width: '60%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          paddingLeft: 0,
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <span
                          className='text-[#19191c]'
                          style={{ fontSize: 14, lineHeight: '20px' }}
                        >
                          {row.col1}
                        </span>
                      </td>
                      <td
                        className='text-right'
                        style={{
                          width: '20%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <span
                          className='text-[#19191c]'
                          style={{ fontSize: 14, lineHeight: '20px' }}
                        >
                          {row.col2}
                        </span>
                      </td>
                      <td
                        className='text-right'
                        style={{
                          width: '20%',
                          height: 72,
                          borderBottom: '1px solid #e6e6ed',
                          paddingRight: 0,
                          verticalAlign: 'top',
                          paddingTop: 26,
                        }}
                      >
                        <span
                          className='text-[#19191c]'
                          style={{ fontSize: 14, lineHeight: '20px' }}
                        >
                          {row.col3}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div style={{ height: 80 }} />
        </div>
      </div>
    </div>
  );
}
