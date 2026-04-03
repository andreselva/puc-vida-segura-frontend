import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAcessoMedico } from '../hooks/useAcessoMedico';
import { AppContainer, PillInput } from '../components/Shared';

export const AcessoMedicoScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getPublicProfile, loading, error } = useAcessoMedico();
  const [linkPerfil, setLinkPerfil] = useState<string>(() => searchParams.get('profile') ?? '');
  const [senhaPublica, setSenhaPublica] = useState<string>('');

  const handleAcesso = async () => {
    if (!linkPerfil) {
      alert('Insira o link do perfil ou o identificador do perfil.');
      return;
    }

    let profileId = linkPerfil.trim();
    try {
      const urlToParse = profileId.startsWith('http') ? profileId : `http://x/?profile=${profileId}`;
      const fromParam = new URL(urlToParse).searchParams.get('profile');
      if (fromParam) profileId = fromParam;
    } catch {
    }

    try {
      const profile = await getPublicProfile(profileId, senhaPublica);
      navigate(`/perfil/${profile.profileId}`, { state: { profile } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContainer>
      <div className="text-[#02C39A] mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </div>
      <h2 className="text-4xl text-[#02C39A] mb-4 text-center">Acesso às informações clínicas</h2>
      <p className="text-gray-500 text-center mb-10 w-full max-w-xl mx-auto">
        Informe o link do perfil ou o identificador do paciente para visualizar as informações clínicas em caso de emergência.
      </p>

      <div className="w-full max-w-md">
        <PillInput placeholder="Link ou ID do Perfil" value={linkPerfil} onChange={(event) => setLinkPerfil(event.target.value)} />
        <PillInput
          placeholder="Senha pública"
          type="password"
          value={senhaPublica}
          onChange={(event) => setSenhaPublica(event.target.value)}
        />
      </div>

      <p className="text-gray-400 font-bold my-4 text-xl">ou</p>

      <div className="mb-10 rounded-full border border-dashed border-[#D1C8C1] p-6 text-center text-gray-400">
        Leitura de QR Code simulada pelo link público acima.
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <button
        onClick={handleAcesso}
        disabled={loading}
        className="bg-[#02C39A] text-white rounded-lg py-2 px-16 font-bold hover:bg-[#02A884] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Acessando...' : 'Acessar'}
      </button>
    </AppContainer>
  );
};
