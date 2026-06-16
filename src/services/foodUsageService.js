import axiosInstance from '../api/axiosInstance';
import { getUserIdFromToken } from './analyticsService';

// GET total food usage stats
export async function fetchFoodUsageTotal({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/food-usage/total', {
    params: { userId, inventoryId, fromDate, toDate },
  });
  return res.data;
}

// GET food usage rows
export async function fetchFoodUsageProducts({
  inventoryId,
  fromDate,
  toDate,
  limit = 10,
  offset = 0,
}) {
  const res = await axiosInstance.get('/analytics/food-usage/product', {
    params: { inventoryId, fromDate, toDate, limit, offset },
  });
  return res.data;
}
