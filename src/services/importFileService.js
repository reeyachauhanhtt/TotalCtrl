import axiosInstance from '../api/axiosInstance';

export const parseExcel = async ({ inventoryId, parseData }) => {
  const res = await axiosInstance.post(
    '/inventory-management/store-products/parse-excel',
    {
      inventoryId,
      language: 'en',
      parseData,
    },
  );
  return res.data?.Data || [];
};
