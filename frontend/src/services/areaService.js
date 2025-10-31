import api from './api.js';

export async function fetchAreas() {
  const { data } = await api.get('/areas');
  return data;
}

export async function createArea(payload) {
  const { data } = await api.post('/areas', payload);
  return data;
}

export async function updateArea(id, payload) {
  const { data } = await api.put(`/areas/${id}`, payload);
  return data;
}

export async function deleteArea(id) {
  await api.delete(`/areas/${id}`);
}

export async function fetchAuthorizedAreas(cardIdentifier) {
  const { data } = await api.get('/areas/authorized', {
    params: { cardIdentifier }
  });
  return data;
}

export async function moveArea(payload) {
  const { data } = await api.post('/areas/movements', payload);
  return data;
}
