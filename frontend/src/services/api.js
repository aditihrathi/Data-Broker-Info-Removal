import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000' 
});

export const sendRemovalRequests = async (userData) => {
    try {
        const response = await api.post('/send-removal-requests', userData);  // match this with your FastAPI endpoint
        return response.data;
    } catch (error) {
        console.error('Error sending removal requests:', error);
        throw error.response?.data || error.message;
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error.response?.data || error.message;
    }
};