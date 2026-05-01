import axiosInstance from '../api/axiosInstance';

export const downloadInventoryCSV = async ({
  inventoryId,
  name,
  supplierIds,
  stockFilter,
}) => {
  const params = {};

  if (inventoryId) params.inventoryId = inventoryId;
  if (name) params.name = name;
  if (supplierIds) params.supplierIds = supplierIds;
  if (stockFilter && stockFilter !== 'all') {
    const stockMap = { in: '1', out: '0', low: '2' };
    params.isInStock = stockMap[stockFilter];
  }

  const res = await axiosInstance.get(
    '/inventory-management/store-products/download-csv',
    { params, responseType: 'blob' },
  );

  return res.data;
};
