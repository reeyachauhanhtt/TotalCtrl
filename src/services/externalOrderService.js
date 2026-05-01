import axiosInstance from '../api/axiosInstance';

const TAB_STATUS_MAP = {
  Scheduled: 'scheduled-order',
  'Partially Delivered': 'partially-delivered',
  Delivered: 'delivered',
};

const ORDER_STATUS_MAP = {
  'Partially Delivered': 'partially-delivered',
  Delivered: 'delivered-order',
};

export async function fetchExternalOrders({
  inventoryId,
  tab,
  offset = 0,
  limit = 20,
}) {
  const status = TAB_STATUS_MAP[tab];
  const { data } = await axiosInstance.get('/orders', {
    params: { status, offset, limit, inventoryId },
  });
  return data;
}

export async function fetchOrderDetail(orderId) {
  const { data } = await axiosInstance.get(`/orders/store-orders/${orderId}`);
  return data;
}

export async function fetchDeliveredOrderDetail({ orderId, orderStatus }) {
  const { data } = await axiosInstance.get(
    '/orders/store-orders/delivered-details',
    {
      params: {
        orderId,
        orderStatus: ORDER_STATUS_MAP[orderStatus] ?? orderStatus,
      },
    },
  );
  return data;
}
