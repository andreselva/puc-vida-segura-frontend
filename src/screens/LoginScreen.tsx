import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { PillInput } from '../components/Shared';
import heroImage from '../assets/hero.png';
import { api } from '../services/api';
import type { DemoAccessInfo } from '../types';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [demoAccess, setDemoAccess] = useState<DemoAccessInfo | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDemoAccess = async () => {
      try {
        const response = await api.getDemoAccessInfo();

        if (isMounted) {
          setDemoAccess(response);
        }
      } catch (err) {
        console.error(err);
      }
    };

    void loadDemoAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      await login(email, senha);
      navigate('/meu-qrcode');
    } catch (err) {
      console.error(err);
    }
  };

  const fillDemoCredentials = () => {
    if (!demoAccess) {
      return;
    }

    setEmail(demoAccess.email);
    setSenha(demoAccess.senha);
  };

  return (
    <div className="flex min-h-screen bg-[#8EE0D6]">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 lg:px-16 py-10 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-[#00605A] font-bold text-xl">
          <span className="text-[#02C39A] text-2xl">❤</span> VidaSegura
        </div>

        <h1 className="text-white text-4xl mb-8 text-center">Acesse sua conta</h1>

        <div className="w-full max-w-sm flex flex-col items-center">
          <PillInput placeholder="e-mail" value={email} onChange={(event) => setEmail(event.target.value)} />
          <PillInput
            type="password"
            placeholder="senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 bg-[#02C39A] text-white rounded-md py-2 px-12 hover:bg-[#02A884] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </div>

        <div className="mt-10 w-full max-w-sm bg-white/20 border border-white/30 rounded-2xl p-4 text-white">
          <p className="font-semibold mb-2">Acesso de demonstração</p>
          <p className="text-sm">E-mail: {demoAccess?.email ?? 'carregando...'}</p>
          <p className="text-sm">Senha: {demoAccess?.senha ?? 'carregando...'}</p>
          <p className="text-sm">Senha pública do perfil: {demoAccess?.senhaPublica ?? 'carregando...'}</p>
          <button
            onClick={fillDemoCredentials}
            disabled={!demoAccess}
            className="mt-3 bg-white text-[#00605A] rounded-md py-2 px-4 font-semibold hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Preencher dados demo
          </button>
        </div>

        <div className="mt-10 text-center text-white">
          <p className="mb-4 text-lg">Ainda não tem conta?</p>
          <button
            onClick={() => navigate('/cadastro')}
            className="bg-[#02C39A] text-white rounded-md py-2 px-8 hover:bg-[#02A884] transition"
          >
            Cadastre-se
          </button>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-[#D4F4EF]">
        <img src={heroImage} alt="Ilustração do aplicativo VidaSegura" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
