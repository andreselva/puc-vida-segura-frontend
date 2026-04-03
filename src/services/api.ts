import axios from 'axios';
import type {
  AppUser,
  AuthenticatedUserResponse,
  ClinicalData,
  DemoAccessInfo,
  LoginResponse,
  PublicPatientProfile,
  RegisterResponse,
  SaveClinicalInfoResponse,
  UserData,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_STORAGE_KEY = 'vida-segura:auth-token';
const LAST_PUBLIC_PROFILE_KEY = 'vida-segura:last-public-profile';

export interface ApiResponse<T> {
  data: T;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  config.headers = config.headers ?? {};
  config.headers['x-frontend-url'] = window.location.origin;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProfileUrl = (profileId: string) => `${window.location.origin}/acesso-medico?profile=${profileId}`;

export const setAuthToken = (token: string) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getAuthToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY);

export const clearAuthSession = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

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

const extractErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const maybeMessage = (data as { message?: unknown }).message;

  if (typeof maybeMessage === 'string') {
    return maybeMessage;
  }

  if (Array.isArray(maybeMessage)) {
    return maybeMessage.filter((item): item is string => typeof item === 'string').join(' ');
  }

  return null;
};

export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return extractErrorMessage(error.response?.data) ?? error.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const api = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, senha });
    setAuthToken(data.token);
    return data;
  },

  async register(userData: UserData): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', userData);
    setAuthToken(data.token);
    return data;
  },

  async getDemoAccessInfo(): Promise<DemoAccessInfo> {
    const { data } = await apiClient.get<DemoAccessInfo>('/auth/demo-access');
    return data;
  },

  async getAuthenticatedUser(): Promise<AppUser | null> {
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    try {
      const { data } = await apiClient.get<AuthenticatedUserResponse>('/users/me');
      return data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearAuthSession();
        return null;
      }

      throw error;
    }
  },

  async saveClinicalInfo(userId: string, clinicalData: ClinicalData): Promise<SaveClinicalInfoResponse> {
    const { data } = await apiClient.put<SaveClinicalInfoResponse>(`/users/${userId}/clinical-info`, clinicalData);
    return data;
  },

  async getPublicProfile(profileId: string, password?: string): Promise<PublicPatientProfile> {
    const { data } = await apiClient.post<PublicPatientProfile>(`/profiles/${profileId}/access`, { password });
    setLastPublicProfile(data);
    return data;
  },
};
