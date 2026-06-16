import axiosInstance from '../api/axiosInstance';

export async function transferItems({ fromInventoryId, toInventoryId, items }) {
  console.log('transferService called');

  const res = await axiosInstance.post('/internal-transfer', {
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
    `/internal-transfer/${transferId}/undo`,
    {},
  );
  return res.data;
}
