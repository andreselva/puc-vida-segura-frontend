export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface UserData {
  nome?: string;
  sobrenome?: string;
  dt_nasc?: string;
  sexo?: string;
  email?: string;
  senha?: string;
  confirmSenha?: string;
}

export interface ClinicalData {
  tipoSanguineo?: string;
  alergias?: string;
  medicamentos?: string;
  doencas?: string;
  cirurgias?: string;
  emergenciaNome?: string;
  emergenciaTelefone?: string;
  senhaPublica?: string;
}

export interface AppUser extends Required<Omit<UserData, 'confirmSenha'>> {
  id: string;
  profileId: string;
  clinicalInfo: ClinicalData;
  createdAt: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    nome: string;
    email: string;
    profileId: string;
  };
}

export interface SaveClinicalInfoResponse {
  message: string;
  user: AppUser;
}

export interface PublicPatientProfile {
  id: string;
  profileId: string;
  nomeCompleto: string;
  sexo: string;
  dt_nasc: string;
  email: string;
  clinicalInfo: ClinicalData;
  profileUrl: string;
}

export interface DemoAccessInfo {
  email: string;
  senha: string;
  senhaPublica: string;
  profileId: string;
  profileUrl: string;
}
