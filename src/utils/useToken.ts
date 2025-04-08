import { useState, useEffect } from "react";
import { API_URL } from "./config";

interface VerifyResult {
  userId: string | null;
  newToken: string | null;
  error: string | null;
  isLoading: boolean;
}

export const useVerifyToken = (token: string | undefined): VerifyResult => {
  const [userId, setUserId] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Токен відсутній");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}api/patients/verify-token/${token}`);
        if (!response.ok) {
          throw new Error("Недійсний токен");
        }

        const data = await response.json();

        if (!data?.id) {
          throw new Error("Некоректна відповідь: ID відсутній");
        }

        setUserId(data.id);

        if (data.token) {
          setNewToken(data.token);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return { userId, newToken, error, isLoading };
};
