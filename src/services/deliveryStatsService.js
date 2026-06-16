import axiosInstance from '../api/axiosInstance';

export async function fetchTotalReturnedGoods({
  inventoryId,
  fromDate,
  toDate,
}) {
  const res = await axiosInstance.get(
    '/analytics/delivery-stats/total-returned-goods',
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
    '/analytics/delivery-stats/supplier-ranking',
    {
      params: { inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}
