import axiosClient from './axiosClient';
import { Role, RoleCreatePayload, RoleUpdatePayload } from '../types/role';

export const RoleApi = {
    getAll: () =>
        axiosClient.get<Role[]>('/roles'),

    getById: (id: string) =>
        axiosClient.get<Role>(`/roles/${id}`),

    create: (payload: RoleCreatePayload) =>
        axiosClient.post<Role>('/roles', payload),

    update: (id: string, payload: RoleUpdatePayload) =>
        axiosClient.put<Role>(`/roles/${id}`, payload),

    delete: (id: string) =>
        axiosClient.delete(`/roles/${id}`),
};
