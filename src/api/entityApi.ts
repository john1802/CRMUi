import axiosClient from './axiosClient';
import { Entity, EntityCreatePayload, EntityUpdatePayload } from '../types/entity';

export const EntityApi = {
  getAll: () =>
    axiosClient.get<Entity[]>('/entities'),

  getById: (id: string) =>
    axiosClient.get<Entity>(`/entities/${id}`),

  create: (payload: EntityCreatePayload) =>
    axiosClient.post<Entity>('/entities', payload),

  update: (id: string, payload: EntityUpdatePayload) =>
    axiosClient.put<Entity>(`/entities/${id}`, payload),

  delete: (id: string) =>
    axiosClient.delete(`/entities/${id}`),
};
