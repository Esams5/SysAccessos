import api from './api.js';

export async function fetchRecommendations(cardIdentifier) {
  const { data } = await api.get('/ai/recommendations', {
    params: { cardIdentifier }
  });
  return data;
}
