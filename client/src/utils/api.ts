import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if backend is hosted elsewhere
});

// Add a request interceptor to include JWT if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
