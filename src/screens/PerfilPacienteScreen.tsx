import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { PublicPatientProfile } from '../types';
import { api, getLastPublicProfile } from '../services/api';

export const PerfilPacienteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const routeProfile = (location.state as { profile?: PublicPatientProfile } | null)?.profile ?? null;
  const cachedProfile = getLastPublicProfile();
  const initialProfile = routeProfile ?? (cachedProfile?.profileId === id ? cachedProfile : null);

  const [profile, setProfile] = useState<PublicPatientProfile | null>(initialProfile);
  const [needsPassword, setNeedsPassword] = useState<boolean>(!initialProfile);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialProfile || !id) return;

    let isMounted = true;
    const tryFetch = async () => {
      setLoading(true);
      try {
        const fetched = await api.getPublicProfile(id, undefined);
        if (isMounted) {
          setProfile(fetched);
          setNeedsPassword(false);
        }
      } catch {
        if (isMounted) {
          setNeedsPassword(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void tryFetch();
    return () => { isMounted = false; };
  }, [id, initialProfile]);

  const handlePasswordSubmit = async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const fetched = await api.getPublicProfile(id, password);
      setProfile(fetched);
      setNeedsPassword(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Senha incorreta ou perfil não encontrado.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#BDECE2] flex items-center justify-center">
        <p className="text-[#00605A] text-lg">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile && needsPassword) {
    return (
      <div className="min-h-screen bg-[#BDECE2] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm max-w-md w-full">
          <h1 className="text-3xl text-[#02C39A] mb-4">Perfil protegido</h1>
          <p className="text-gray-500 mb-6">
            Este perfil exige uma senha pública para ser visualizado.
          </p>
          <input
            type="password"
            placeholder="Senha pública"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handlePasswordSubmit()}
            className="w-full bg-[#F5EFEF] border border-[#E5D5D5] text-[#555] rounded-full py-2 px-6 text-center focus:outline-none focus:ring-2 focus:ring-[#02C39A] placeholder:text-[#888] mb-4"
          />
          {loadError && <p className="text-red-500 text-sm mb-4">{loadError}</p>}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/acesso-medico')}
              className="bg-[#D1C8C1] text-white rounded-lg py-2 px-6 font-bold hover:bg-[#bbaeA4] transition"
            >
              Voltar
            </button>
            <button
              onClick={() => void handlePasswordSubmit()}
              disabled={loading || !password}
              className="bg-[#02C39A] text-white rounded-lg py-2 px-6 font-bold hover:bg-[#02A884] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Acessar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#BDECE2] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm max-w-xl">
          <h1 className="text-3xl text-[#02C39A] mb-4">Perfil indisponível</h1>
          <p className="text-gray-500 mb-6">
            Perfil não encontrado. Verifique o link e tente novamente pela tela de acesso médico.
          </p>
          <button
            onClick={() => navigate('/acesso-medico')}
            className="bg-[#02C39A] text-white rounded-lg py-2 px-8 font-bold hover:bg-[#02A884] transition"
          >
            Ir para acesso médico
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BDECE2] flex flex-col items-center pt-10 px-6 font-sans">
      <div className="text-center mb-8 mt-10">
        <h1 className="text-5xl text-gray-500 font-light mb-2">{profile.nomeCompleto}</h1>
        <p className="text-[#02C39A] italic text-lg">{profile.sexo}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-3xl p-10 w-full lg:w-1/2 shadow-sm">
          <h2 className="text-2xl text-[#02C39A] text-center mb-6">Dados Médicos</h2>
          <ul className="text-gray-500 space-y-3 list-disc pl-5 text-lg">
            <li>
              <strong>Tipo sanguíneo:</strong> {profile.clinicalInfo.tipoSanguineo || 'Não informado'}
            </li>
            <li>
              <strong>Alergias:</strong> {profile.clinicalInfo.alergias || 'Não informado'}
            </li>
            <li>
              <strong>Medicamentos utilizados:</strong> {profile.clinicalInfo.medicamentos || 'Não informado'}
            </li>
            <li>
              <strong>Doenças:</strong> {profile.clinicalInfo.doencas || 'Não informado'}
            </li>
            <li>
              <strong>Cirurgias realizadas:</strong> {profile.clinicalInfo.cirurgias || 'Não informado'}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-10 w-full lg:w-1/2 shadow-sm flex flex-col justify-center items-center">
          <h2 className="text-2xl text-[#02C39A] text-center mb-10 w-full">Contato de Emergência</h2>
          <div className="text-gray-500 text-lg space-y-2 text-center">
            <p>
              <strong>Nome:</strong> {profile.clinicalInfo.emergenciaNome || 'Não informado'}
            </p>
            <p>
              <strong>Telefone:</strong> {profile.clinicalInfo.emergenciaTelefone || 'Não informado'}
            </p>
            <p>
              <strong>Data de nascimento:</strong> {profile.dt_nasc || 'Não informado'}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-12 text-gray-500 italic text-center text-sm w-full max-w-lg">
        Estas informações são fornecidas pelo próprio usuário para situações de emergência.
      </p>
    </div>
  );
};
