import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const fetchProducts = async ({
  inventoryId,
  supplierIds = null,
  offset = 0,
  limit = 20,
  isInStock = '0,1,2',
}) => {
  try {
    if (!inventoryId) throw new Error('inventoryId is required');

    const params = {
      inventoryId,
      isInStock,
      sortBy: 'productName',
      sortOrder: 'ASC',
      limit,
      offset,
      name: '',
    };

    if (supplierIds) params.supplierIds = supplierIds;

    const res = await axiosInstance.get(API_ENDPOINTS.STORE_PRODUCTS, {
      params,
    });

    return res.data?.Data || [];
  } catch (err) {
    console.error('Product fetch failed:', err);
    throw err;
  }
};

//add items
export const createStoreProduct = async (payload) => {
  const res = await axiosInstance.post(API_ENDPOINTS.STORE_PRODUCTS, payload);
  return res.data;
};

//search to add items
export const searchProducts = async (name) => {
  const res = await axiosInstance.get(API_ENDPOINTS.STORE_PRODUCTS_SEARCH, {
    params: { name, limit: 20, offset: 0 },
  });
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
    API_ENDPOINTS.STORE_PRODUCT_DETAIL(rawId),
    payload,
  );
  return res.data;
};

//delete items
export const deleteStoreProduct = async ({ rawId, inventoryId }) => {
  const res = await axiosInstance.delete(
    API_ENDPOINTS.STORE_PRODUCT_DETAIL(rawId),
    {
      data: { inventoryId },
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return res.data;
};

//download pdf
export const generateProductsPdf = async () => {
  const res = await axiosInstance.post(API_ENDPOINTS.GENERATE_PRODUCTS_PDF, {
    language: 'en',
  });
  return res.data;
};
