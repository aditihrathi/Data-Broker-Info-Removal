import { useState } from 'react';
import { sendRemovalRequests } from '../services/api';

export const useRemovalRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitRequest = async (userData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await sendRemovalRequests(userData);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send removal requests');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitRequest,
        isLoading,
        error,
        success,
        clearError: () => setError(null),
        clearSuccess: () => setSuccess(false)
    };
};