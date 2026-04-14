import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5099/';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the bearer token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiClient = {
  get: async (endpoint: string) => {
    try {
      const response = await client.get(endpoint);
      return response.data;
    } catch (error: any) {
      console.error('GET request error:', error?.response?.data || error.message);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await client.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error('POST request error:', error?.response?.data || error.message);
      // Re-throw with server message if available
      const message = error?.response?.data?.message || error.message;
      throw new Error(message);
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const response = await client.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error('PUT request error:', error?.response?.data || error.message);
      const message = error?.response?.data?.message || error.message;
      throw new Error(message);
    }
  },
};

export default apiClient;
