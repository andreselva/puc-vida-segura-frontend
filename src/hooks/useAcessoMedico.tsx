import { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import type { PublicPatientProfile } from '../types';

export const useAcessoMedico = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PublicPatientProfile | null>(null);

  const getPublicProfile = async (profileId: string, publicPassword?: string): Promise<PublicPatientProfile> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<PublicPatientProfile>(`/profiles/${profileId}`, { password: publicPassword });
      setPatientData(response.data);
      return response.data;
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, 'Perfil não encontrado ou senha incorreta');
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { getPublicProfile, patientData, loading, error };
};
