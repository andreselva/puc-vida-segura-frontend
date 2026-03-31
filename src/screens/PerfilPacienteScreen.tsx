import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { PublicPatientProfile } from '../types';
import { getLastPublicProfile } from '../services/api';

export const PerfilPacienteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const routeProfile = (location.state as { profile?: PublicPatientProfile } | null)?.profile ?? null;
  const cachedProfile = getLastPublicProfile();
  const profile = routeProfile ?? (cachedProfile?.profileId === id ? cachedProfile : null);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#BDECE2] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm max-w-xl">
          <h1 className="text-3xl text-[#02C39A] mb-4">Perfil indisponível</h1>
          <p className="text-gray-500 mb-6">
            Este perfil precisa ser liberado pela tela de acesso médico. Volte e informe o link do perfil com a senha pública.
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
