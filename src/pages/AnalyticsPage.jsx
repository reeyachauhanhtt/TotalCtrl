<<<<<<< HEAD
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

import { getPersistedDateRange } from "../utils/analyticsDateRange";
=======
import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { getPersistedDateRange } from '../utils/analyticsDateRange';
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
import {
  fetchTotalFoodCost,
  fetchFoodCostPercentageTime,
  fetchMonthlyCogsMonthList,
<<<<<<< HEAD
} from "../services/analyticsService";
import LightSpeedBanner from "../components/Analytics/LightSpeedBanner";
import RealTimeInventorySection from "../components/Analytics/RealTimeInventorySection";
import FoodUsageSection from "../components/Analytics/FoodUsageSection";
import PurchasesSection from "../components/Analytics/PurchasesSection";
import AnalyticsDetailPage from "./AnalyticsDetailPage";
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
} from "../store/analyticsSlice";
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDetailOpen = useSelector((s) => s.analytics.isDetailOpen);

<<<<<<< HEAD
  const { fromDate, toDate } = getPersistedDateRange(
    "analytics_date_range_analytics_page"
  ) ?? {
    fromDate: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    toDate: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
  };

  useQuery({
    queryKey: ["totalFoodCost", fromDate, toDate],
=======
  const { fromDate, toDate } = getPersistedDateRange();

  useQuery({
    queryKey: ['totalFoodCost', fromDate, toDate],
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
    queryFn: () => fetchTotalFoodCost({ fromDate, toDate }),
    staleTime: 0,
  });

  useQuery({
<<<<<<< HEAD
    queryKey: ["foodCostPercentageTime", fromDate, toDate],
=======
    queryKey: ['foodCostPercentageTime', fromDate, toDate],
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
    queryFn: () =>
      fetchFoodCostPercentageTime({
        fromDate,
        toDate,
<<<<<<< HEAD
        dateRangeType: "last 7 days",
=======
        dateRangeType: 'last 7 days',
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
      }),
    staleTime: 0,
  });

  useQuery({
<<<<<<< HEAD
    queryKey: ["monthlyCogsMonthList"],
=======
    queryKey: ['monthlyCogsMonthList'],
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
    queryFn: fetchMonthlyCogsMonthList,
    staleTime: 0,
  });

  useEffect(() => {
    return () => {
      dispatch(setAnalyticsDetailOpen(false));
      dispatch(setAnalyticsSelectedInventory(null));
    };
  }, []);

<<<<<<< HEAD
  const isOverview = location.pathname === "/analytics-overview";
  const isStatsDetail = location.pathname.includes("/analytics/by");

  if (isOverview)
    return (
      <div className="h-full overflow-y-auto px-9 pb-15">
=======
  const isOverview = location.pathname === '/analytics-overview';
  const isStatsDetail = location.pathname.includes('/analytics/by');

  if (isOverview)
    return (
      <div className='h-full overflow-y-auto px-9 pb-15'>
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
        <LightSpeedBanner />
        <RealTimeInventorySection />
        <FoodUsageSection />
        <PurchasesSection />
      </div>
    );

  if (isDetailOpen || isStatsDetail) return <AnalyticsDetailPage />;

<<<<<<< HEAD
  return <Navigate to="/analytics-overview" replace />;
=======
  return <Navigate to='/analytics-overview' replace />;
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
}
