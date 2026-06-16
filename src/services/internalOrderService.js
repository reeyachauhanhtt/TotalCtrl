import axiosInstance from '../api/axiosInstance';

//fetch internal orders
export const fetchInternalOrders = async ({
  inventoryId,
  status,
  offset = 0,
  limit = 20,
}) => {
  const { data } = await axiosInstance.get('/internal-order', {
    params: { inventoryId, status, offset, limit, language: 'en' },
  });
  return data;
};

//fetch internal order detail by id
export const fetchInternalOrderDetail = async (orderId) => {
  const { data } = await axiosInstance.get(`/internal-order/${orderId}`);
  return data;
};

//add order
export const createInternalOrder = async (payload) => {
  const { data } = await axiosInstance.post('/internal-order', payload);
  return data;
};

//update order
export const updateInternalOrder = async (orderId, payload) => {
  const { data } = await axiosInstance.put(
    `/internal-order/${orderId}`,
    payload,
  );
  return data;
};

//delete order
export const deleteInternalOrder = async (orderId) => {
  const { data } = await axiosInstance.delete(`/internal-order/${orderId}`);
  return data;
};
