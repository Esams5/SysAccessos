import api from './api.js';

export async function fetchVisitors() {
  const { data } = await api.get('/visitors');
  return data;
}

export async function createVisitor(payload) {
  const { data } = await api.post('/visitors', payload);
  return data;
}

export async function updateVisitor(id, payload) {
  const { data } = await api.put(`/visitors/${id}`, payload);
  return data;
}

export async function deleteVisitor(id) {
  await api.delete(`/visitors/${id}`);
}

