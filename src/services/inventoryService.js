import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const TOKEN = import.meta.env.VITE_API_TOKEN;
console.log('TOKEN:', TOKEN);

//Fetch inventories
export async function fetchInventory() {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY_ME_ACCESS);
    console.log('RAW API:', res.data);
    return res.data;
  } catch (err) {
    console.error('API ERROR:', err);
    throw err;
  }
}

//Fetch stock value
export const fetchStockValue = async (inventoryId) => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY_STOCK_VALUE, {
      params: { inventoryId },
    });

    return res.data;
  } catch (err) {
    console.error('Fetch stock value error:', err);
    throw err;
  }
};
