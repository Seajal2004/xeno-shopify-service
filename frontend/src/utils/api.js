import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (shopDomain, email, password) => api.post('/auth/register', { shopDomain, email, password }),
};

export const shopifyAPI = {
  connect: (accessToken) => api.post('/shopify/connect', { accessToken }),
  sync: () => api.post('/shopify/sync'),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getOrders: (startDate, endDate) => api.get('/analytics/orders', { params: { startDate, endDate } }),
  getCustomers: () => api.get('/analytics/customers'),
  getProducts: () => api.get('/analytics/products'),
};

export default api;