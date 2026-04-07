import axios from 'axios';

const BASE_URL = 'https://localhost:7156/';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
