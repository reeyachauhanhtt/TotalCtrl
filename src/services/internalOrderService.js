import axiosInstance from '../api/axiosInstance';

export const fetchInternalOrders = async ({
  inventoryId,
  status,
  offset = 0,
  limit = 20,
}) => {
  const res = await axiosInstance.get('/internal-order', {
    params: { inventoryId, status, offset, limit, language: 'en' },
  });
  return res.data;
};
