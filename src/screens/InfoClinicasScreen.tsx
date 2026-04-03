import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfoClinicas } from '../hooks/useInfoClinicas';
import type { AppUser, ClinicalData } from '../types';
import { AppContainer, PillInput } from '../components/Shared';
import { api } from '../services/api';

export const InfoClinicasScreen: React.FC = () => {
  const navigate = useNavigate();
  const { saveClinicalInfo, loading, error } = useInfoClinicas();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [formData, setFormData] = useState<ClinicalData>({});

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const user = await api.getAuthenticatedUser();

        if (!isMounted) {
          return;
        }

        if (!user) {
          navigate('/login', { replace: true });
          return;
        }

        setCurrentUser(user);
        setFormData(user.clinicalInfo || {});
      } catch (err) {
        console.error(err);
        if (isMounted) {
          navigate('/login', { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleChange = (field: keyof ClinicalData, value: string) => {
    setFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      alert('Nenhum usuário autenticado foi encontrado.');
      return;
    }

    try {
      const response = await saveClinicalInfo(currentUser.id, formData);
      setCurrentUser(response.user);
      navigate('/meu-qrcode');
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingUser) {
    return (
      <AppContainer>
        <p className="text-[#00605A] text-lg">Carregando dados do usuário...</p>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <h2 className="text-4xl text-[#02C39A] mb-10 text-center">Informações Clínicas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 w-full">
        <div>
          <h3 className="text-xl text-[#02C39A] text-center mb-4">Informações Médicas</h3>
          <PillInput
            placeholder="Tipo Sanguíneo"
            value={formData.tipoSanguineo || ''}
            onChange={(event) => handleChange('tipoSanguineo', event.target.value)}
          />
          <PillInput
            placeholder="Alergias"
            value={formData.alergias || ''}
            onChange={(event) => handleChange('alergias', event.target.value)}
          />
          <PillInput
            placeholder="Medicamentos Utilizados"
            value={formData.medicamentos || ''}
            onChange={(event) => handleChange('medicamentos', event.target.value)}
          />
          <PillInput
            placeholder="Doenças"
            value={formData.doencas || ''}
            onChange={(event) => handleChange('doencas', event.target.value)}
          />
          <PillInput
            placeholder="Cirurgias"
            value={formData.cirurgias || ''}
            onChange={(event) => handleChange('cirurgias', event.target.value)}
          />
        </div>

        <div>
          <h3 className="text-xl text-[#02C39A] text-center mb-4">Contato de Emergência</h3>
          <PillInput
            placeholder="Nome"
            value={formData.emergenciaNome || ''}
            onChange={(event) => handleChange('emergenciaNome', event.target.value)}
          />
          <PillInput
            placeholder="Telefone"
            value={formData.emergenciaTelefone || ''}
            onChange={(event) => handleChange('emergenciaTelefone', event.target.value)}
          />

          <h3 className="text-xl text-[#02C39A] text-center mt-8 mb-2">Senha de Acesso Público</h3>
          <p className="text-xs text-center text-gray-400 mb-4 px-4">
            Essa senha será usada para liberar o acesso médico ao perfil público do paciente.
          </p>
          <PillInput
            placeholder="Senha"
            type="password"
            value={formData.senhaPublica || ''}
            onChange={(event) => handleChange('senhaPublica', event.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate('/login')}
          className="bg-[#D1C8C1] text-white rounded-lg py-2 px-12 font-bold hover:bg-[#bbaeA4] transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#02C39A] text-white rounded-lg py-2 px-12 font-bold hover:bg-[#02A884] transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </AppContainer>
  );
};
