import axiosInstance from '../api/axiosInstance';
import { getUserIdFromToken } from './analyticsService';

//PURCHASE TOTAL VALUE
export async function fetchPurchaseTotal({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/purchase/total', {
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
  const res = await axiosInstance.get('/analytics/purchase/biggest-orders', {
    params: { inventoryId, fromDate, toDate, limit, offset },
  });
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
  const res = await axiosInstance.get('/analytics/purchase/biggest-suppliers', {
    params: { inventoryId, fromDate, toDate, limit, offset },
  });
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
  const res = await axiosInstance.get('/analytics/purchase/price-variations', {
    params: { inventoryId, fromDate, toDate, limit, offset },
  });
  return res.data;
}
