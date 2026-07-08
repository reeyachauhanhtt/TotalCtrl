import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

//fetch users
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

// fetch roles
export async function fetchUserRoles() {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGE_USERS.ROLES);
  return data.Data;
}

// fetch admin emails if username is entered
export async function fetchAdminEmails() {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGE_USERS.ADMINS);
  return data.Data;
}

// get store user by id
export async function fetchStoreUserById(id) {
  const { data } = await axiosInstance.get(
    `${API_ENDPOINTS.MANAGE_USERS.LIST}/${id}`,
  );
  return data.Data;
}

// add user
export async function createUser(payload) {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.MANAGE_USERS.LIST,
    payload,
  );
  return data.Data;
}

// edit user
export async function updateUser(id, payload) {
  const { data } = await axiosInstance.put(
    `${API_ENDPOINTS.MANAGE_USERS.LIST}/${id}`,
    payload,
  );
  return data.Data;
}

// delete user
export async function deleteUser(id) {
  const { data } = await axiosInstance.delete(
    `${API_ENDPOINTS.MANAGE_USERS.LIST}/${id}`,
  );
  return data.Data;
}

//activate or deactivate a user
export async function updateUserStatus(id, isActive) {
  const { data } = await axiosInstance.put(
    `${API_ENDPOINTS.MANAGE_USERS.LIST}/${id}`,
    { isActive: isActive ? 1 : 0 },
  );
  return data.Data;
}
