import axiosInstance from '../api/axiosInstance';

export const fetchSuppliers = async () => {
  try {
    const res = await axiosInstance.get('/suppliers');
    const data = res.data?.Data || res.data?.data || [];
    return data;
  } catch (err) {
    console.error('Supplier fetch failed:', err);
    throw err;
  }
};
