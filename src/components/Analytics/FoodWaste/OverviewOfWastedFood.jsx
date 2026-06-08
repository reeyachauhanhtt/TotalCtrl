import ReactApexChart from 'react-apexcharts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { fetchFoodWasteOverview } from '../../../services/foodWasteService';

export default function OverviewOfWastedFood({ inventoryId }) {
  const persisted = getPersistedDateRange();
  const [dateRange, setDateRange] = useState({
    fromDate: persisted.fromDate,
    toDate: persisted.toDate,
    label: persisted.label ?? 'last month',
  });

  const { data: overviewData } = useQuery({
    queryKey: ['foodWaste-overview', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodWasteOverview({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        dateRangeType: dateRange.label ?? 'last month',
      }),
    enabled: !!inventoryId && !!dateRange.fromDate,
    select: (res) => res.Data?.foodWaste,
  });

  const xAxis = overviewData?.xAxis ?? [];
  const yAxis = overviewData?.yAxis ?? [];

  const series = [{ name: '', data: yAxis }];

  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '60%' } },
    colors: ['rgba(102,200,136,0.85)'],
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#e0e0e0',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: xAxis,
      labels: { style: { colors: '#939397', fontSize: '12px' }, rotate: 0 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#939397', fontSize: '11px' },
        formatter: (val) => `${val} kr`,
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} kr` },
    },
  };

  function handleApply({ startDate, endDate, label }) {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
      label: label ?? 'last month',
    });
  }
  return (
    <div>
      <div
        className='flex justify-between items-center w-full'
        style={{ padding: '38px 0 0' }}
      >
        <span
          className='font-semibold text-[#19191c]'
          style={{ fontSize: 18, lineHeight: '24px', letterSpacing: '-0.01em' }}
        >
          Overview of wasted food
        </span>
        <div style={{ marginLeft: 20 }}>
          <MonthPicker onApply={handleApply} />
        </div>
      </div>

      <div
        style={{
          width: '100%',
          textAlign: 'center',
          height: 300,
          marginTop: 16,
        }}
      >
        <ReactApexChart
          options={options}
          series={series}
          type='bar'
          width='100%'
          height={234}
        />
      </div>
    </div>
  );
}
