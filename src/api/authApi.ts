import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tenantId?: string;
}

export const AuthApi = {
  login: (payload: LoginPayload) =>
    axiosClient.post<LoginResponse>('/Auth/login', payload),

  logout: () =>
    axiosClient.post('/Auth/logout'),

  refreshToken: () =>
    axiosClient.post<LoginResponse>('/Auth/refresh'),
};
