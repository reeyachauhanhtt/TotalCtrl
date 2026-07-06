import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export async function fetchStoreUsers({
  search = '',
  includeInactive = true,
  includeDeleted = false,
  offset = 0,
  limit = 20,
}) {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGE_USERS.LIST, {
    params: { search, includeInactive, includeDeleted, offset, limit },
  });
  return { users: data.Data, meta: data.meta };
}

export async function fetchUserRoles() {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGE_USERS.ROLES);
  return data.Data;
}
