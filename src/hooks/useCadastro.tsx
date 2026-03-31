import { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import type { RegisterResponse, UserData } from '../types';

export const useCadastro = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: UserData): Promise<RegisterResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      return response.data;
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, 'Erro ao cadastrar');
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
