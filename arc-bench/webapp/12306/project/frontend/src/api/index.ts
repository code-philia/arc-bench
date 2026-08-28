import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;

export function setUser(user: any | null) {
  if (user) localStorage.setItem('train-user', JSON.stringify(user));
  else localStorage.removeItem('train-user');
}

export function getUser(): any | null {
  try { return JSON.parse(localStorage.getItem('train-user') || 'null'); } catch { return null; }
}

apiClient.interceptors.request.use((config) => {
  const user = getUser();
  if (user?.id) config.headers['x-user-id'] = String(user.id);
  return config;
});
