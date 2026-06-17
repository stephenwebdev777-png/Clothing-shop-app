
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  // We'll add token from AsyncStorage later
  return config;
});

export default api;
