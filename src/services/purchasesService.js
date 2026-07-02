import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getUserIdFromToken } from './analyticsService';

//PURCHASE TOTAL VALUE
export async function fetchPurchaseTotal({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get(API_ENDPOINTS.ANALYTICS_PURCHASE_TOTAL, {
    params: { userId, inventoryId, fromDate, toDate },
  });
  return res.data;
}

//BIGGEST ORDER
export async function fetchBiggestOrders({
  inventoryId,
  fromDate,
  toDate,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_PURCHASE_BIGGEST_ORDERS,
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

//BIGGEST SUPPLIERS
export async function fetchBiggestSuppliers({
  inventoryId,
  fromDate,
  toDate,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_PURCHASE_BIGGEST_SUPPLIERS,
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

//PRICE VARIATION
export async function fetchPriceVariations({
  inventoryId,
  fromDate,
  toDate,
  limit = 4,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_PURCHASE_PRICE_VARIATIONS,
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}
