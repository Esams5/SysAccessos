import api from './api.js';

export async function fetchHistory(params = {}) {
  const { data } = await api.get('/history', { params });
  return data;
}

export async function fetchHistoryByUser(userId) {
  const { data } = await api.get(`/history/user/${userId}`);
  return data;
}
