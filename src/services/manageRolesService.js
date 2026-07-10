import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// fetch all the roles
export const fetchRoles = async ({ search = '', offset = 0, limit = 20 }) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.GET_STORE_ROLES, {
    params: { search, language: 'en', offset, limit },
  });
  return data;
};

// add role
export const addRole = async ({ name, description, isActive }) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.ADD_STORE_ROLE, {
    name,
    description,
    isActive: isActive ? '1' : '0',
  });
  return data;
};

// update role
export const updateRole = async (roleId, { name, description, isActive }) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_STORE_ROLE(roleId),
    { name, description, isActive: isActive ? '1' : '0' },
  );
  return data;
};

// delete role
export const deleteRole = async (roleId) => {
  const { data } = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_STORE_ROLE(roleId),
  );
  return data;
};
