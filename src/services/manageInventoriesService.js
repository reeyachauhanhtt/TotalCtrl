import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const fetchInventoriesWithAccess = async () => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.INVENTORY_STORE_USERS_ACCESS,
    {
      params: {
        includeInactive: true,
        includeDeleted: false,
        offset: 0,
        limit: 50,
      },
    },
  );
  return res.data.Data;
  console.log(res.data.Data);
};

export const fetchInventoryAccessMap = async (inventoryIds) => {
  const results = await Promise.all(
    inventoryIds.map((id) =>
      axiosInstance
        .get(API_ENDPOINTS.INVENTORY_ACCESS(id))
        .then((res) => res.data.Data.users ?? [])
        .catch(() => []),
    ),
  );
  const map = {};
  results.flat().forEach((u) => {
    if (!map[u.userPermissionId]) {
      map[u.userPermissionId] = u.permissionName;
    }
  });
  return map;
};

//activate or deactivate inventories
export const updateInventoryStatus = async (id, isActive) => {
  const res = await axiosInstance.put(API_ENDPOINTS.INVENTORY_DETAIL(id), {
    isActive,
  });

  return res.data.Data;
};

// ADD INVENTORY
export const createInventory = async (name) => {
  const res = await axiosInstance.post(API_ENDPOINTS.INVENTORY, { name });
  return res.data.Data;
};

// EDIT INVENTORY
export const updateInventoryName = async (id, name) => {
  const res = await axiosInstance.put(API_ENDPOINTS.INVENTORY_DETAIL(id), {
    name,
  });
  return res.data.Data;
};

// DELETE INVENTORY
export const deleteInventory = async (id) => {
  const res = await axiosInstance.delete(API_ENDPOINTS.INVENTORY_DETAIL(id));
  return res.data;
};

//MANAGE ACCESS
export const fetchInventoryAccessDetails = async (inventoryId) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.INVENTORY_ACCESS(inventoryId),
  );
  return res.data.Data;
};

export const updateInventoryAccess = async (inventoryId, users) => {
  const res = await axiosInstance.put(
    API_ENDPOINTS.INVENTORY_ACCESS(inventoryId),
    {
      users,
    },
  );
  return res.data;
};

//PERMISSION
export const fetchStoreUserPermissions = async () => {
  const res = await axiosInstance.get(API_ENDPOINTS.STORE_USERS_PERMISSIONS);
  return res.data.Data;
};
