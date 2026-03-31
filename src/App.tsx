import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginScreen } from './screens/LoginScreen';
import { CadastroScreen } from './screens/CadastroScreen';
import { InfoClinicasScreen } from './screens/InfoClinicasScreen';
import { QRCodeScreen } from './screens/QRCodeScreen';
import { AcessoMedicoScreen } from './screens/AcessoMedicoScreen';
import { PerfilPacienteScreen } from './screens/PerfilPacienteScreen';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cadastro" element={<CadastroScreen />} />
        <Route path="/info-clinicas" element={<InfoClinicasScreen />} />
        <Route path="/meu-qrcode" element={<QRCodeScreen />} />
        <Route path="/acesso-medico" element={<AcessoMedicoScreen />} />
        <Route path="/perfil/:id" element={<PerfilPacienteScreen />} />
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-[#BDECE2] flex items-center justify-center text-2xl text-[#00605A]">
              Página não encontrada (404)
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;