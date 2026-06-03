import axiosInstance from '../api/axiosInstance';

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
  const response = await axiosInstance.get('/analytics/inventory/total');
  return response.data;
};

//FETCH FOOD USAGE
export const fetchFoodUsage = async ({ fromDate, toDate }) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get('/analytics/food-usage/total', {
    params: { fromDate, toDate, ...(userId && { userId }) },
  });
  return response.data;
};

//FETCH PURCHASES
export const fetchPurchases = async ({ fromDate, toDate }) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.get('/analytics/purchase/total', {
    params: { fromDate, toDate, ...(userId && { userId }) },
  });
  return response.data;
};
