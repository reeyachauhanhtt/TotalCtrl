import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const fetchSuppliers = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.SUPPLIERS);
    const data = res.data?.Data || res.data?.data || [];
    return data;
  } catch (err) {
    console.error('Supplier fetch failed:', err);
    throw err;
  }
};
