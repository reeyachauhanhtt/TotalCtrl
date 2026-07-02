import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export async function transferItems({ fromInventoryId, toInventoryId, items }) {
  console.log('transferService called');

  const res = await axiosInstance.post(API_ENDPOINTS.INTERNAL_TRANSFER, {
    fromInventoryId,
    toInventoryId,
    products: items.map((i) => ({
      storeProductItemId: i.storeProductId,
      quantity: Number(i.quantity),
    })),
  });
  return res.data;
}

export async function undoTransfer(transferId) {
  const res = await axiosInstance.post(
    API_ENDPOINTS.INTERNAL_TRANSFER_UNDO(transferId),
    {},
  );
  return res.data;
}
