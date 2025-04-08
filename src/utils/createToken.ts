import { useState } from "react";
import { API_URL } from "./config";

type TokenMap = { [key: string]: string };

export const useStudentToken = () => {
  const [tokens, setTokens] = useState<TokenMap>({});

  const getTokenForId = async (id: string | number) => {
    const idKey = String(id);
    
    if (tokens[idKey]) {
      return tokens[idKey];
    }

    try {
      const response = await fetch(`${API_URL}api/patients/generate-token/${id}`);
      if (!response.ok) {
        throw new Error("Не вдалося отримати токен");
      }

      const data = await response.json();
      setTokens((prevTokens) => ({ ...prevTokens, [idKey]: data.token }));
      return data.token;
    } catch (error) {
      console.error("Помилка отримання токену:", error);
      return null;
    }
  };

  return { getTokenForId };
};
