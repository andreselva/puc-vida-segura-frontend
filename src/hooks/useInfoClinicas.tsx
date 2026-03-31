import { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import type { ClinicalData, SaveClinicalInfoResponse } from '../types';

export const useInfoClinicas = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveClinicalInfo = async (userId: string, clinicalData: ClinicalData): Promise<SaveClinicalInfoResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<SaveClinicalInfoResponse>(`/users/${userId}/clinical-info`, clinicalData);
      return response.data;
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, 'Erro ao salvar informações clínicas');
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { saveClinicalInfo, loading, error };
};
