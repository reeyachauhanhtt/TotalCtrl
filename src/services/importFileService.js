import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const parseExcel = async ({ inventoryId, parseData }) => {
  const res = await axiosInstance.post(
    API_ENDPOINTS.INVENTORY_IMPORT_PARSE_EXCEL,
    {
      inventoryId,
      language: 'en',
      parseData,
    },
  );
  return res.data?.Data || [];
};
