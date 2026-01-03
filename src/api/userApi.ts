import axiosClient from './axiosClient';
import { User, UserCreatePayload, UserUpdatePayload, UserStatusPayload } from '../types/user';

export const UserApi = {
    getAll: () =>
        axiosClient.get<User[]>('/users'),

    getById: (id: string) =>
        axiosClient.get<User>(`/users/${id}`),

    create: (payload: UserCreatePayload) =>
        axiosClient.post<User>('/users', payload),

    update: (id: string, payload: UserUpdatePayload) =>
        axiosClient.put<User>(`/users/${id}`, payload),

    updateStatus: (id: string, payload: UserStatusPayload) =>
        axiosClient.patch(`/users/${id}/status`, payload),
};
