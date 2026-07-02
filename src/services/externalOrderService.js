import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const TAB_STATUS_MAP = {
  Scheduled: 'scheduled-order',
  'Partially Delivered': 'partially-delivered',
  Delivered: 'delivered',
};

const ORDER_STATUS_MAP = {
  'Partially Delivered': 'partially-delivered',
  Delivered: 'delivered-order',
};

//fetch external orders
export async function fetchExternalOrders({
  inventoryId,
  tab,
  offset = 0,
  limit = 20,
}) {
  const status = TAB_STATUS_MAP[tab];
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDERS, {
    params: { status, offset, limit, inventoryId },
  });
  return data;
}

//fetch external orders details by id
export async function fetchOrderDetail(orderId) {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDER_DETAIL(orderId));
  return data;
}

//fetch order details by id for delivered orders
export async function fetchDeliveredOrderDetail({ orderId, orderStatus }) {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.ORDER_DELIVERED_DETAILS,
    {
      params: {
        orderId,
        orderStatus: ORDER_STATUS_MAP[orderStatus] ?? orderStatus,
      },
    },
  );
  return data;
}

//add orders
export async function createOrder(payload) {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.STORE_ORDERS,
    payload,
  );
  return data;
}

//edit orders
export async function updateOrder(orderId, payload) {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.ORDER_DETAIL(orderId),
    payload,
  );
  return data;
}

//delete orders
export async function deleteOrder(orderId) {
  const { data } = await axiosInstance.delete(
    API_ENDPOINTS.ORDER_DETAIL(orderId),
  );
  return data;
}
