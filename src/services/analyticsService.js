import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const getUserIdFromToken = () => {
  const token = import.meta.env.VITE_API_TOKEN;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || payload.id || null;
  } catch {
    return null;
  }
};

//FETCH REAL TIME INVENTORY VALUE
export const fetchAnalyticsStockValue = async () => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_INVENTORY_TOTAL,
  );
  return response.data;
};

//FETCH FOOD USAGE
export const fetchFoodUsage = async ({ fromDate, toDate }) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_FOOD_USAGE_TOTAL,
    {
      params: { fromDate, toDate, ...(userId && { userId }) },
    },
  );
  return response.data;
};

//FETCH PURCHASES
export const fetchPurchases = async ({ fromDate, toDate }) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_PURCHASE_TOTAL,
    {
      params: { fromDate, toDate, ...(userId && { userId }) },
    },
  );
  return response.data;
};

//FETCH TOTAL FOOD COST
export const fetchTotalFoodCost = async ({ fromDate, toDate }) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_TOTAL_FOOD_COST,
    {
      params: { language: 'en', fromDate, toDate, ...(userId && { userId }) },
    },
  );
  return response.data;
};

//FETCH FOOD COST PERCENTAGE OVER TIME
export const fetchFoodCostPercentageTime = async ({
  fromDate,
  toDate,
  dateRangeType,
}) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_FOOD_COST_PERCENTAGE_TIME,
    {
      params: { fromDate, toDate, dateRangeType, ...(userId && { userId }) },
    },
  );
  return response.data;
};

//FETCH MONTHLY COGS MONTH LIST
export const fetchMonthlyCogsMonthList = async () => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_MONTHLY_COGS_MONTH_LIST,
    {
      params: { ...(userId && { userId }) },
    },
  );
  return response.data;
};
