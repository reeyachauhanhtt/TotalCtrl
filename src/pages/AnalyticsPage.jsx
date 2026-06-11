import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { getPersistedDateRange } from '../utils/analyticsDateRange';
import {
  fetchTotalFoodCost,
  fetchFoodCostPercentageTime,
  fetchMonthlyCogsMonthList,
} from '../services/analyticsService';
import LightSpeedBanner from '../components/Analytics/LightSpeedBanner';
import RealTimeInventorySection from '../components/Analytics/RealTimeInventorySection';
import FoodUsageSection from '../components/Analytics/FoodUsageSection';
import PurchasesSection from '../components/Analytics/PurchasesSection';
import AnalyticsDetailPage from './AnalyticsDetailPage';
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
} from '../store/analyticsSlice';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDetailOpen = useSelector((s) => s.analytics.isDetailOpen);

  const { fromDate, toDate } = getPersistedDateRange();

  useQuery({
    queryKey: ['totalFoodCost', fromDate, toDate],
    queryFn: () => fetchTotalFoodCost({ fromDate, toDate }),
    staleTime: 0,
  });

  useQuery({
    queryKey: ['foodCostPercentageTime', fromDate, toDate],
    queryFn: () =>
      fetchFoodCostPercentageTime({
        fromDate,
        toDate,
        dateRangeType: 'last 7 days',
      }),
    staleTime: 0,
  });

  useQuery({
    queryKey: ['monthlyCogsMonthList'],
    queryFn: fetchMonthlyCogsMonthList,
    staleTime: 0,
  });

  useEffect(() => {
    return () => {
      dispatch(setAnalyticsDetailOpen(false));
      dispatch(setAnalyticsSelectedInventory(null));
    };
  }, []);

  const isOverview = location.pathname === '/analytics-overview';
  const isStatsDetail = location.pathname.includes('/analytics/by');

  if (isOverview)
    return (
      <div className='h-full overflow-y-auto px-9 pb-15'>
        <LightSpeedBanner />
        <RealTimeInventorySection />
        <FoodUsageSection />
        <PurchasesSection />
      </div>
    );

  if (isDetailOpen || isStatsDetail) return <AnalyticsDetailPage />;

  return <Navigate to='/analytics-overview' replace />;
}
