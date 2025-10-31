import api from './api.js';

export async function simulateAccess(payload) {
  const { data } = await api.post('/access/simulate', payload);
  return data;
}

