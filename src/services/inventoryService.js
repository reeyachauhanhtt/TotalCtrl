import axiosInstance from '../api/axiosInstance';

const TOKEN = import.meta.env.VITE_API_TOKEN;
console.log('TOKEN:', TOKEN);

//Fetch inventories
export async function fetchInventory() {
  try {
    const res = await fetch(`/inventory/me/access`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch inventory');
    }

    const data = await res.json();
    console.log('RAW API:', data);
    return data;
  } catch (err) {
    console.error('API ERROR:', err);
    throw err;
  }
}

//Fetch stock value
export const fetchStockValue = async (inventoryId) => {
  try {
    const res = await axiosInstance.get(
      '/inventory-management/store-products/stock-value',
      {
        params: { inventoryId },
      },
    );

    return res.data;
  } catch (err) {
    console.error('Fetch stock value error:', err);
    throw err;
  }
};
