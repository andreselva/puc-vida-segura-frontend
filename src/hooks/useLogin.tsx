import { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import type { LoginResponse } from '../types';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, senha: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, senha });
      return response.data;
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, 'Erro ao fazer login');
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
