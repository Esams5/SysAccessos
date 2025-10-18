import api from './api.js';

export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data;
}

