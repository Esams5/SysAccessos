import api from './api.js';

export async function fetchPermissions() {
  const { data } = await api.get('/permissions');
  return data;
}

export async function fetchPermissionsByUser(userId) {
  const { data } = await api.get(`/permissions/user/${userId}`);
  return data;
}

export async function createPermission(payload) {
  const { data } = await api.post('/permissions', payload);
  return data;
}

export async function updatePermission(id, payload) {
  const { data } = await api.put(`/permissions/${id}`, payload);
  return data;
}

export async function deletePermission(id) {
  await api.delete(`/permissions/${id}`);
}
