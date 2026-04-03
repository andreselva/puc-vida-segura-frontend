export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    profileId: string;
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

export interface AppUser {
  id: string;
  profileId: string;
  nome: string;
  sobrenome: string;
  dt_nasc: string;
  sexo: string;
  email: string;
  clinicalInfo: ClinicalData;
  createdAt: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
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
  clinicalInfo: Omit<ClinicalData, 'senhaPublica'>;
  profileUrl: string;
}

export interface DemoAccessInfo {
  email: string;
  senha: string;
  senhaPublica: string;
  profileId: string;
  profileUrl: string;
}

export interface AuthenticatedUserResponse {
  user: AppUser | null;
}
