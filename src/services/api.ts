import type {
  AppUser,
  ClinicalData,
  DemoAccessInfo,
  LoginResponse,
  PublicPatientProfile,
  RegisterResponse,
  SaveClinicalInfoResponse,
  UserData,
} from '../types';

const DB_STORAGE_KEY = 'vida-segura:mock-db';
const SESSION_STORAGE_KEY = 'vida-segura:session-user-id';
const LAST_PUBLIC_PROFILE_KEY = 'vida-segura:last-public-profile';

interface MockDatabase {
  users: AppUser[];
}

interface MockResponse<T> {
  data: T;
}

class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const demoUser: AppUser = {
  id: 'user-demo-1',
  profileId: 'perfil-demo-001',
  nome: 'João',
  sobrenome: 'da Silva',
  dt_nasc: '1987-05-13',
  sexo: 'Masculino',
  email: 'joao.silva@vidasegura.app',
  senha: '123456',
  clinicalInfo: {
    tipoSanguineo: 'O+',
    alergias: 'Penicilina, poeira',
    medicamentos: 'Losartana 50mg (uso diário)',
    doencas: 'Hipertensão arterial',
    cirurgias: 'Apendicectomia (2015)',
    emergenciaNome: 'Mariana Silva',
    emergenciaTelefone: '(54) 99987-4321',
    senhaPublica: '4321',
  },
  createdAt: '2026-03-30T12:00:00.000Z',
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const wait = async (ms = 250) => {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
};

const getBaseUrl = () => window.location.origin;

export const getProfileUrl = (profileId: string) => `${getBaseUrl()}/acesso-medico?profile=${profileId}`;

const buildPublicProfile = (user: AppUser): PublicPatientProfile => ({
  id: user.id,
  profileId: user.profileId,
  nomeCompleto: `${user.nome} ${user.sobrenome}`.trim(),
  sexo: user.sexo,
  dt_nasc: user.dt_nasc,
  email: user.email,
  clinicalInfo: clone(user.clinicalInfo),
  profileUrl: getProfileUrl(user.profileId),
});

const createInitialDb = (): MockDatabase => ({ users: [clone(demoUser)] });

const persistDb = (db: MockDatabase) => {
  window.localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
};

const readDb = (): MockDatabase => {
  const rawDb = window.localStorage.getItem(DB_STORAGE_KEY);

  if (!rawDb) {
    const initialDb = createInitialDb();
    persistDb(initialDb);
    return initialDb;
  }

  try {
    const parsedDb = JSON.parse(rawDb) as MockDatabase;

    if (!Array.isArray(parsedDb.users)) {
      throw new Error('Estrutura inválida');
    }

    return parsedDb;
  } catch {
    const initialDb = createInitialDb();
    persistDb(initialDb);
    return initialDb;
  }
};

const saveDb = (db: MockDatabase) => {
  persistDb(db);
  return db;
};

const setSessionUserId = (userId: string) => {
  window.localStorage.setItem(SESSION_STORAGE_KEY, userId);
};

const getSessionUserId = () => window.localStorage.getItem(SESSION_STORAGE_KEY);

const setLastPublicProfile = (profile: PublicPatientProfile) => {
  window.sessionStorage.setItem(LAST_PUBLIC_PROFILE_KEY, JSON.stringify(profile));
};

export const getLastPublicProfile = (): PublicPatientProfile | null => {
  const rawProfile = window.sessionStorage.getItem(LAST_PUBLIC_PROFILE_KEY);

  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile) as PublicPatientProfile;
  } catch {
    return null;
  }
};

export const ensureMockDatabase = () => {
  readDb();
};

const sanitizeLoginUser = (user: AppUser) => ({
  id: user.id,
  nome: `${user.nome} ${user.sobrenome}`.trim(),
  email: user.email,
});

const requireText = (value: string | undefined, fieldName: string): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new ApiError(`O campo ${fieldName} é obrigatório.`);
  }

  return normalizedValue;
};

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const getUserById = (userId: string): AppUser | undefined => readDb().users.find((user) => user.id === userId);

export const getAuthenticatedUser = (): AppUser | null => {
  const userId = getSessionUserId();

  if (!userId) {
    return null;
  }

  const user = getUserById(userId);
  return user ? clone(user) : null;
};

export const getDemoAccessInfo = (): DemoAccessInfo => ({
  email: demoUser.email,
  senha: demoUser.senha,
  senhaPublica: demoUser.clinicalInfo.senhaPublica ?? '',
  profileId: demoUser.profileId,
  profileUrl: getProfileUrl(demoUser.profileId),
});

const registerUser = (userData: UserData): RegisterResponse => {
  const nome = requireText(userData.nome, 'nome');
  const sobrenome = requireText(userData.sobrenome, 'sobrenome');
  const dtNasc = requireText(userData.dt_nasc, 'data de nascimento');
  const sexo = requireText(userData.sexo, 'sexo');
  const email = requireText(userData.email, 'e-mail');
  const senha = requireText(userData.senha, 'senha');
  const confirmSenha = requireText(userData.confirmSenha, 'confirmação de senha');

  if (senha !== confirmSenha) {
    throw new ApiError('As senhas não coincidem.');
  }

  const db = readDb();
  const normalizedEmail = email.toLowerCase();
  const existingUser = db.users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    throw new ApiError('Já existe um cadastro com esse e-mail.', 409);
  }

  const newUser: AppUser = {
    id: generateId('user'),
    profileId: generateId('perfil'),
    nome,
    sobrenome,
    dt_nasc: dtNasc,
    sexo,
    email: normalizedEmail,
    senha,
    clinicalInfo: {},
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);
  setSessionUserId(newUser.id);

  return {
    message: 'Cadastro realizado com sucesso.',
    user: {
      id: newUser.id,
      nome: `${newUser.nome} ${newUser.sobrenome}`.trim(),
      email: newUser.email,
      profileId: newUser.profileId,
    },
  };
};

const authenticateUser = (email: string | undefined, senha: string | undefined): LoginResponse => {
  const normalizedEmail = requireText(email, 'e-mail').toLowerCase();
  const normalizedPassword = requireText(senha, 'senha');

  const user = readDb().users.find(
    (currentUser) => currentUser.email.toLowerCase() === normalizedEmail && currentUser.senha === normalizedPassword,
  );

  if (!user) {
    throw new ApiError('E-mail ou senha inválidos.', 401);
  }

  setSessionUserId(user.id);

  return {
    token: `mock-token-${user.id}`,
    user: sanitizeLoginUser(user),
  };
};

const updateClinicalInfo = (userId: string, clinicalData: ClinicalData): SaveClinicalInfoResponse => {
  const db = readDb();
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new ApiError('Usuário não encontrado.', 404);
  }

  const currentUser = db.users[userIndex];
  const updatedUser: AppUser = {
    ...currentUser,
    clinicalInfo: {
      ...currentUser.clinicalInfo,
      ...clinicalData,
    },
  };

  db.users[userIndex] = updatedUser;
  saveDb(db);

  return {
    message: 'Informações clínicas salvas com sucesso.',
    user: clone(updatedUser),
  };
};

const fetchPublicProfile = (profileId: string, password?: string): PublicPatientProfile => {
  const user = readDb().users.find((currentUser) => currentUser.profileId === profileId || currentUser.id === profileId);

  if (!user) {
    throw new ApiError('Perfil não encontrado.', 404);
  }

  const requiredPassword = user.clinicalInfo.senhaPublica?.trim();
  const informedPassword = password?.trim();

  if (requiredPassword && requiredPassword !== informedPassword) {
    throw new ApiError('Senha pública inválida para este perfil.', 401);
  }

  const publicProfile = buildPublicProfile(user);
  setLastPublicProfile(publicProfile);
  return publicProfile;
};

const parseProfileIdFromUrl = (url: string): string => {
  const matchedProfile = url.match(/^\/profiles\/([^/]+)$/);

  if (!matchedProfile) {
    throw new ApiError('Rota de perfil inválida.', 404);
  }

  return matchedProfile[1];
};

export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const api = {
  async post<T>(url: string, body?: unknown): Promise<MockResponse<T>> {
    await wait();

    if (url === '/auth/login') {
      const payload = body as { email?: string; senha?: string };
      return { data: authenticateUser(payload.email, payload.senha) as T };
    }

    if (url === '/auth/register') {
      return { data: registerUser(body as UserData) as T };
    }

    if (url.startsWith('/profiles/')) {
      const payload = body as { password?: string } | undefined;
      const profileId = parseProfileIdFromUrl(url);
      return { data: fetchPublicProfile(profileId, payload?.password) as T };
    }

    throw new ApiError('Endpoint mock não implementado.', 404);
  },

  async put<T>(url: string, body?: unknown): Promise<MockResponse<T>> {
    await wait();

    const matchedUser = url.match(/^\/users\/([^/]+)\/clinical-info$/);

    if (!matchedUser) {
      throw new ApiError('Endpoint mock não implementado.', 404);
    }

    return { data: updateClinicalInfo(matchedUser[1], (body ?? {}) as ClinicalData) as T };
  },
};
