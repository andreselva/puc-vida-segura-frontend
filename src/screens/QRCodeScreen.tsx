import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '../components/Shared';
import { MockQrCode } from '../components/MockQrCode';
import type { AppUser } from '../types';
import { api, getProfileUrl } from '../services/api';

export const QRCodeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

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

  const profileUrl = useMemo(() => {
    if (!currentUser) {
      return '';
    }

    return getProfileUrl(currentUser.profileId);
  }, [currentUser]);

  const handleCopyLink = async () => {
    if (!profileUrl) {
      return;
    }

    await navigator.clipboard.writeText(profileUrl);
    alert('Link do perfil copiado.');
  };

  if (loadingUser) {
    return (
      <AppContainer>
        <p className="text-[#00605A] text-lg">Carregando seu perfil...</p>
      </AppContainer>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <AppContainer>
      <div className="text-[#02C39A] mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v-3m0 0v3m0-3h3m-3 0H9" />
        </svg>
      </div>
      <h2 className="text-4xl text-[#02C39A] mb-8 text-center">QRCode de Acesso</h2>

      <MockQrCode value={profileUrl} />

      <p className="text-gray-500 mt-6 mb-4 font-medium text-center break-all">{profileUrl}</p>
      <p className="text-gray-500 text-sm mb-2 text-center">ID do perfil: {currentUser.profileId}</p>
      <p className="text-gray-500 text-sm mb-8 text-center">
        Senha pública: {currentUser.clinicalInfo.senhaPublica || 'não definida'}
      </p>

      <div className="bg-[#F5EFEF] rounded-2xl px-4 py-3 text-sm text-gray-600 mb-8 text-center max-w-xl">
        O QR exibido aqui é um mock visual para demonstração. O link público já funciona no fluxo do app.
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate('/info-clinicas')}
          className="bg-[#D1C8C1] text-white rounded-lg py-2 px-10 font-bold hover:bg-[#bbaeA4] transition"
        >
          Voltar
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-[#02C39A] text-white rounded-lg py-2 px-10 font-bold hover:bg-[#02A884] transition"
        >
          Copiar link
        </button>
      </div>
    </AppContainer>
  );
};
