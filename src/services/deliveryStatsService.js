import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export async function fetchTotalReturnedGoods({
  inventoryId,
  fromDate,
  toDate,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_DELIVERY_TOTAL_RETURNED_GOODS,
    {
      params: { inventoryId, fromDate, toDate },
    },
  );
  return res.data;
}

export async function fetchSupplierRanking({
  inventoryId,
  fromDate,
  toDate,
  limit = 20,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_DELIVERY_SUPPLIER_RANKING,
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}
