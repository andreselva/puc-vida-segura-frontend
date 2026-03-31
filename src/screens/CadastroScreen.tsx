import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCadastro } from '../hooks/useCadastro';
import type { UserData } from '../types';
import { AppContainer, PillInput } from '../components/Shared';

export const CadastroScreen: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useCadastro();
  const [formData, setFormData] = useState<UserData>({});

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      await register(formData);
      navigate('/info-clinicas');
    } catch (err) {
      console.error(err);
    }
  };

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
      <h2 className="text-4xl text-[#02C39A] mb-10 text-center">Cadastro</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 w-full">
        <div>
          <PillInput placeholder="Nome" value={formData.nome || ''} onChange={(event) => handleChange('nome', event.target.value)} />
          <PillInput
            placeholder="Sobrenome"
            value={formData.sobrenome || ''}
            onChange={(event) => handleChange('sobrenome', event.target.value)}
          />
          <PillInput
            placeholder="Data de Nascimento"
            type="date"
            value={formData.dt_nasc || ''}
            onChange={(event) => handleChange('dt_nasc', event.target.value)}
          />
          <PillInput placeholder="Sexo" value={formData.sexo || ''} onChange={(event) => handleChange('sexo', event.target.value)} />
        </div>
        <div>
          <PillInput
            placeholder="E-mail"
            type="email"
            value={formData.email || ''}
            onChange={(event) => handleChange('email', event.target.value)}
          />
          <PillInput
            placeholder="Senha"
            type="password"
            value={formData.senha || ''}
            onChange={(event) => handleChange('senha', event.target.value)}
          />
          <PillInput
            placeholder="Confirmar Senha"
            type="password"
            value={formData.confirmSenha || ''}
            onChange={(event) => handleChange('confirmSenha', event.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 text-center w-full">{error}</p>}

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate('/login')}
          className="bg-[#D1C8C1] text-white rounded-lg py-2 px-10 font-bold hover:bg-[#bbaeA4] transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-[#02C39A] text-white rounded-lg py-2 px-10 font-bold hover:bg-[#02A884] transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : 'Continuar'}
        </button>
      </div>
    </AppContainer>
  );
};
