import { useState, useEffect, useCallback } from 'react';
import { API_URL } from './config';

export function useSchoolName(userId: string | null) {
    const [schoolName, setSchoolName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchoolName = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}api/patients/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch institution');
            }
            const data = await response.json();
            setSchoolName(data.institution || null);
        } catch (error) {
            setError('Error fetching institution');
            console.error('Error fetching institution:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchSchoolName();
    }, [fetchSchoolName]);

    return { schoolName, loading, error, refetch: fetchSchoolName };
}
