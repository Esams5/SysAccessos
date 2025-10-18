import api from './api.js';

export async function fetchHistory(params = {}) {
  const { data } = await api.get('/history', { params });
  return data;
}

export async function createHistoryEntry(payload) {
  const { data } = await api.post('/history', payload);
  return data;
}

