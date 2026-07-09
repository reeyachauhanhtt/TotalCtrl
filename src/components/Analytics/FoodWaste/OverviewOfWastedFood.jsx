import ReactApexChart from 'react-apexcharts';
import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { fetchFoodWasteOverview } from '../../../services/foodWasteService';
import { GreenDotSkeleton } from '../../Common/Skeleton';

export default function OverviewOfWastedFood({ inventoryId }) {
  const persisted = getPersistedDateRange(
    'analytics_date_range_overview_of_wasted_food',
  );

  const [dateRange, setDateRange] = useState({
    fromDate:
      persisted?.fromDate ?? format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: persisted?.toDate ?? format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    label: persisted?.label ?? 'This Month',
  });
  const chartWrapperRef = useRef(null);
  const tooltipBoxRef = useRef(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [xAxisHover, setXAxisHover] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['foodWaste-overview', inventoryId, dateRange],
    queryFn: () =>
      fetchFoodWasteOverview({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        dateRangeType: dateRange.label ?? 'This Month',
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
    select: (res) => res.Data?.foodWaste,
  });

  const xAxis = overviewData?.xAxis ?? [];
  const yAxis = overviewData?.yAxis ?? [];

  const series = useMemo(() => [{ name: '', data: yAxis }], [yAxis]);

  function formatTooltipLabel(label) {
    return String(label ?? '')
      .replace(/,(\S)/g, ' $1')
      .replace(/([A-Za-z])(\d)/g, '$1 $2');
  }

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        zoom: { enabled: false },
        dropShadow: { enabled: false },
        selection: { enabled: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 600,
          animateGradually: {
            enabled: true,
            delay: 45,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 600,
          },
        },
        events: {
          dataPointMouseEnter: function (event, chartContext, config) {
            if (event?.target) {
              event.target.style.fill = 'rgb(45,159,90)';
            }

            const { seriesIndex, dataPointIndex, w } = config;

            const value =
              w.config.series?.[seriesIndex]?.data?.[dataPointIndex];

            const label =
              w.globals.categoryLabels?.[dataPointIndex] ??
              w.globals.labels?.[dataPointIndex] ??
              '';

            setHoveredPoint({
              seriesIndex,
              dataPointIndex,
              value,
              label,
            });

            const gridLeft = w.globals.translateX;
            const gridTop = w.globals.translateY;
            const gridWidth = w.globals.gridWidth;
            const gridHeight = w.globals.gridHeight;
            const totalPoints = w.globals.labels?.length || xAxis.length || 1;
            const slotWidth = gridWidth / totalPoints;

            setXAxisHover({
              label,
              x: gridLeft + slotWidth * dataPointIndex + slotWidth / 2,
              y: gridTop + gridHeight + 2,
            });
          },
          dataPointMouseLeave: function (event) {
            if (event?.target) {
              event.target.style.fill = 'rgba(102,200,136,0.85)';
            }

            setHoveredPoint(null);
            setXAxisHover(null);
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '70%',
          backgroundBarColors: ['transparent'],
          backgroundBarOpacity: 0,
        },
      },
      colors: ['rgba(102,200,136,0.85)'],
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
        normal: { filter: { type: 'none' } },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#e0e0e0',
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories: xAxis,
        labels: {
          show: true,
          style: { colors: '#939397', fontSize: '12px' },
          rotate: 0,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: { show: false },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          style: { colors: '#939397', fontSize: '11px' },
          formatter: (val) => `${val} kr`,
        },
      },
      tooltip: {
        enabled: false,
      },
    }),
    [xAxis],
  );

  function handleApply({ startDate, endDate, label }) {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
      label: label ?? 'last month',
    });
  }

  function handleMouseMove(event) {
    const wrapper = chartWrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();

    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function getTooltipPosition() {
    const wrapper = chartWrapperRef.current;
    const tooltip = tooltipBoxRef.current;

    const wrapperWidth = wrapper?.clientWidth ?? 0;
    const wrapperHeight = wrapper?.clientHeight ?? 0;
    const tooltipWidth = tooltip?.offsetWidth ?? 120;
    const tooltipHeight = tooltip?.offsetHeight ?? 58;

    const offsetX = 14;
    const offsetY = 12;

    const x = Math.min(
      Math.max(cursor.x + offsetX, 0),
      Math.max(wrapperWidth - tooltipWidth, 0),
    );

    const y = Math.min(
      Math.max(cursor.y - tooltipHeight - offsetY, 0),
      Math.max(wrapperHeight - tooltipHeight, 0),
    );

    return { x, y };
  }

  const tooltipPosition = getTooltipPosition();

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
          <MonthPicker
            onApply={handleApply}
            storageKey='analytics_date_range_overview_of_wasted_food'
          />
        </div>
      </div>

      <div
        ref={chartWrapperRef}
        className={xAxisHover ? 'hide-xaxis-labels' : ''}
        style={{
          position: 'relative',
          width: '100%',
          textAlign: 'center',
          height: 300,
          marginTop: 16,
          overflow: 'visible',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredPoint(null);
          setXAxisHover(null);
        }}
      >
        <style>{`
          .hide-xaxis-labels .apexcharts-xaxis-texts-g text {
            opacity: 0;
          }

          .apexcharts-xaxis-texts-g text {
            transition: opacity 0.1s ease;
          }

          .apexcharts-bar-area {
            transform-box: fill-box;
            transform-origin: bottom;
            animation: barBounceIn 650ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes barBounceIn {
            0% {
              transform: scaleY(0);
            }
            70% {
              transform: scaleY(1.06);
            }
            100% {
              transform: scaleY(1);
            }
          }
        `}</style>

        {isLoading ? (
          <GreenDotSkeleton />
        ) : (
          <ReactApexChart
            key={`${dateRange.fromDate}-${dateRange.toDate}-${xAxis.length}-${yAxis.length}`}
            options={options}
            series={series}
            type='bar'
            width='100%'
            height={234}
          />
        )}

        {xAxisHover && (
          <div
            style={{
              position: 'absolute',
              left: xAxisHover.x,
              top: xAxisHover.y,
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'block',
              background: 'rgb(236, 239, 241)',
              color: 'rgb(55, 61, 63)',
              border: '1px solid rgb(144, 164, 174)',
              borderRadius: 2,
              boxShadow: 'none',
              fontFamily: 'SourceSansProRegular',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '19.5px',
              padding: '9px 10px',
              pointerEvents: 'none',
              whiteSpace: 'pre-line',
              minWidth: 58,
            }}
          >
            {formatTooltipLabel(xAxisHover.label)}
          </div>
        )}

        {chartWrapperRef.current &&
          createPortal(
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  ref={tooltipBoxRef}
                  data-custom-tooltip
                  initial={{
                    opacity: 0,
                    x: tooltipPosition.x,
                    y: tooltipPosition.y + 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: tooltipPosition.x,
                    y: tooltipPosition.y,
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.12, ease: 'easeOut' },
                  }}
                  transition={{
                    x: {
                      type: 'spring',
                      stiffness: 420,
                      damping: 34,
                      mass: 0.7,
                    },
                    y: {
                      type: 'spring',
                      stiffness: 520,
                      damping: 26,
                      mass: 0.7,
                    },
                    opacity: { duration: 0.12 },
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 20,
                    pointerEvents: 'none',
                    background: '#fff',
                    border: '1px solid rgb(227,227,227)',
                    borderRadius: 5,
                    boxShadow: 'rgb(153,153,153) 2px 2px 6px -4px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: 12,
                    color: 'rgb(134,139,161)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      padding: '6px 10px',
                      borderBottom: '1px solid rgb(227,227,227)',
                      background: 'rgb(245,245,245)',
                    }}
                  >
                    {formatTooltipLabel(hoveredPoint.label)}
                  </div>

                  <div
                    style={{
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'rgb(102,200,136)',
                      }}
                    />

                    <span style={{ fontWeight: 600, color: '#737373' }}>
                      {hoveredPoint.value} kr
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            chartWrapperRef.current,
          )}
      </div>
    </div>
  );
}
