import axios from 'react'; // Stub

const api = {
    post: async (endpoint: string, data: any) => {
        // Implementation logic for axios.post(`https://localhost:5001/api/v1${endpoint}`, data)
        console.log(`Sending data to ${endpoint}:`, data);
        return { data: { message: "Mock Success" }};
    }
};

export default api;
