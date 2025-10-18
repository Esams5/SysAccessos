import api from './api.js';

export async function fetchVisits() {
  const { data } = await api.get('/visits');
  return data;
}

export async function createVisit(payload) {
  const { data } = await api.post('/visits', payload);
  return data;
}

export async function updateVisit(id, payload) {
  const { data } = await api.put(`/visits/${id}`, payload);
  return data;
}

export async function deleteVisit(id) {
  await api.delete(`/visits/${id}`);
}

