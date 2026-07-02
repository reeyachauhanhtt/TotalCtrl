import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

//fetch internal orders
export const fetchInternalOrders = async ({
  inventoryId,
  status,
  offset = 0,
  limit = 20,
}) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.INTERNAL_ORDER, {
    params: { inventoryId, status, offset, limit, language: 'en' },
  });
  return data;
};

//fetch internal order detail by id
export const fetchInternalOrderDetail = async (orderId) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.INTERNAL_ORDER_DETAIL(orderId),
  );
  return data;
};

//add order
export const createInternalOrder = async (payload) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.INTERNAL_ORDER,
    payload,
  );
  return data;
};

//update order
export const updateInternalOrder = async (orderId, payload) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.INTERNAL_ORDER_DETAIL(orderId),
    payload,
  );
  return data;
};

//delete order
export const deleteInternalOrder = async (orderId) => {
  const { data } = await axiosInstance.delete(
    API_ENDPOINTS.INTERNAL_ORDER_DETAIL(orderId),
  );
  return data;
};
