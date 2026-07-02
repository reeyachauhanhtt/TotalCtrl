import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getUserIdFromToken } from './analyticsService';

// GET inv name + total value
export async function fetchInventoryTotal({ inventoryId }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get(API_ENDPOINTS.ANALYTICS_INVENTORY_TOTAL, {
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
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_INVENTORY_VALUE_BY_STOCK,
    {
      params: { inventoryId, limit, offset },
    },
  );
  return res.data;
}

// GET value by category
export async function fetchValueByCategory({
  inventoryId,
  limit = 6,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_INVENTORY_VALUE_BY_CATEGORY,
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
    API_ENDPOINTS.ANALYTICS_INVENTORY_CHECK_IN_VALUE,
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
    API_ENDPOINTS.ANALYTICS_INVENTORY_CHECK_OUT_VALUE,
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
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_INVENTORY_EXPORT,
    {
      params: { inventoryId, userId, fromDate, toDate, language },
    },
  );
  return res.data;
}
