import axios from 'axios';

// 1. Define Base URL for Backend Server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Auto-apply JWT Token if logged in sets thresholds dashboard trigger)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization headers mapping setup triggers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Centralized Endpoints Export accurately framed triggers
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
};

export const userApi = {
  getStats: () => apiClient.get('/users/stats'),
  getAll: () => apiClient.get('/users'),
  getProfile: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  changePassword: (data) => apiClient.post('/users/change-password', data),
};

export const examApi = {
  getAll: () => apiClient.get('/exams'),
  create: (data) => apiClient.post('/exams', data),
  update: (id, data) => apiClient.put(`/exams/${id}`, data),
  delete: (id) => apiClient.delete(`/exams/${id}`),
};

export const collegeApi = {
  getAll: () => apiClient.get('/colleges'),
  create: (data) => apiClient.post('/colleges', data),
  update: (id, data) => apiClient.put(`/colleges/${id}`, data),
  delete: (id) => apiClient.delete(`/colleges/${id}`),
  predict: (data) => apiClient.post('/colleges/predict', data), // predict rank output datasets match
  getCutoffs: () => apiClient.get('/colleges/cutoffs/list'),
  createCutoff: (data) => apiClient.post('/colleges/cutoffs', data),
  updateCutoff: (id, data) => apiClient.put(`/colleges/cutoffs/${id}`, data),
  deleteCutoff: (id) => apiClient.delete(`/colleges/cutoffs/${id}`),
};

export const sessionApi = {
  create: (data) => apiClient.post('/sessions', data),
  getAll: (params) => apiClient.get('/sessions', { params }),
};

export const chatApi = {
  getMessages: (user1Id, user2Id) => apiClient.get(`/chat/${user1Id}/${user2Id}`),
  sendMessage: (data) => apiClient.post('/chat', data),
};

export default apiClient;
