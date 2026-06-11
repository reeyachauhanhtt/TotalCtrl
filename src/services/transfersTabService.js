import axiosInstance from '../api/axiosInstance';
import { getUserIdFromToken } from './analyticsService';

//  transfer IN summary
export async function fetchTransferIn({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/transfer/in', {
    params: { userId, inventoryId, fromDate, toDate },
  });
  return res.data;
}

// transfer OUT summary
export async function fetchTransferOut({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/transfer/out', {
    params: { userId, inventoryId, fromDate, toDate },
  });
  return res.data;
}

// transfer items (infinite scroll)
export async function fetchTransferItems({
  inventoryId,
  fromDate,
  toDate,
  involvedInventoryIds = '',
  transferType = '',
  limit = 10,
  offset = 0,
  sortBy = 'transferDate',
  sortOrder = 'DESC',
}) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/transfer/items', {
    params: {
      userId,
      inventoryId,
      fromDate,
      toDate,
      involvedInventoryIds,
      transferType,
      limit,
      offset,
      sortBy,
      sortOrder,
    },
  });
  return res.data;
}

// involved inventories for dropdown
export async function fetchTransferItemInventories({
  inventoryId,
  fromDate,
  toDate,
}) {
  const res = await axiosInstance.get('/analytics/transfer/item-inventories', {
    params: { inventoryId, fromDate, toDate },
  });
  return res.data;
}
