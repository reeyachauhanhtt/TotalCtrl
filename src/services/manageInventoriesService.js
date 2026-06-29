import axiosInstance from '../api/axiosInstance';

export const fetchInventoriesWithAccess = async () => {
  const res = await axiosInstance.get('/inventory/store-users/access', {
    params: {
      includeInactive: true,
      includeDeleted: false,
      offset: 0,
      limit: 50,
    },
  });
  return res.data.Data;
};

export const fetchInventoryAccessMap = async (inventoryIds) => {
  const results = await Promise.all(
    inventoryIds.map((id) =>
      axiosInstance
        .get(`/inventory/${id}/access`)
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
  const res = await axiosInstance.put(`/inventory/${id}`, {
    isActive,
  });

  return res.data.Data;
};
