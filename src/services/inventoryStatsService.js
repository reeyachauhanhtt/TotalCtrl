import axiosInstance from '../api/axiosInstance';
import { getUserIdFromToken } from './analyticsService';

// GET inv name + total value
export async function fetchInventoryTotal({ inventoryId }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/inventory/total', {
    params: { inventoryId, userId },
  });
  return res.data;
}

// GET value by supplier
export async function fetchValueBySupplier({
  inventoryId,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get('/analytics/inventory/value-by-stock', {
    params: { inventoryId, limit, offset },
  });
  return res.data;
}

// GET value by category
export async function fetchValueByCategory({
  inventoryId,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    '/analytics/inventory/value-by-category',
    {
      params: { inventoryId, limit, offset },
    },
  );
  return res.data;
}

// GET check in
export async function fetchCheckInValue({
  inventoryId,
  fromDate,
  toDate,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    '/analytics/inventory/check-in-value-by-category',
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

// GET check out
export async function fetchCheckOutValue({
  inventoryId,
  fromDate,
  toDate,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    '/analytics/inventory/check-out-value-by-category',
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

//Export Button - xlsx download
export async function fetchInventoryExport({
  inventoryId,
  fromDate,
  toDate,
  language = 'en',
}) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/inventory/export', {
    params: { inventoryId, userId, fromDate, toDate, language },
  });
  return res.data;
}
