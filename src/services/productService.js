import axiosInstance from '../api/axiosInstance';

export const fetchProducts = async ({
  inventoryId,
  supplierIds = null,
  offset = 0,
}) => {
  try {
    if (!inventoryId) throw new Error('inventoryId is required');

    const params = {
      inventoryId,
      isInStock: '0,1,2',
      sortBy: 'productName',
      sortOrder: 'ASC',
      limit: 20,
      offset,
      name: '',
    };

    if (supplierIds) params.supplierIds = supplierIds;

    const res = await axiosInstance.get(
      '/inventory-management/store-products',
      { params },
    );

    return res.data?.Data || [];
  } catch (err) {
    console.error('Product fetch failed:', err);
    throw err;
  }
};

//add items
export const createStoreProduct = async (payload) => {
  const res = await axiosInstance.post(
    '/inventory-management/store-products',
    payload,
  );
  return res.data;
};

//search to add items
export const searchProducts = async (name) => {
  const res = await axiosInstance.get(
    '/inventory-management/store-products/search',
    {
      params: { name, limit: 20, offset: 0 },
    },
  );
  return res.data?.Data || [];
};

//update items
export const updateStoreProduct = async ({
  rawId,
  inventoryId,
  stockTakingUnitId,
  batches,
}) => {
  const now = new Date().toISOString();
  const payload = {
    products: batches.map((b) => ({
      id: b.expiryDateId, // ← unique per-batch ID
      quantity: Number(b.quantity),
      expirationDate: b.expirationDate || null,
      isManual: b.isManual ?? 0,
      isDeleted: 0,
      stockCountItemId: b.stockCountItemId ?? null,
      daysLeft: b.daysLeft ?? 0,
      selected: false,
    })),
    stockTakingUnitId,
    inventoryId,
    dateAndTime: now,
  };
  const res = await axiosInstance.put(
    `/inventory-management/store-products/${rawId}`,
    payload,
  );
  return res.data;
};

//delete items
export const deleteStoreProduct = async ({ rawId, inventoryId }) => {
  const res = await axiosInstance.delete(
    `/inventory-management/store-products/${rawId}`,
    {
      data: { inventoryId },
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return res.data;
};
