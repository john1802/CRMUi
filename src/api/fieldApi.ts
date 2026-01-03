import axiosClient from './axiosClient';
import { Field, FieldCreatePayload } from '../types/field';

export const FieldApi = {
  getByEntity: (entityId: string) =>
    axiosClient.get<Field[]>(`/entities/${entityId}/fields`),

  getById: (entityId: string, fieldId: string) =>
    axiosClient.get<Field>(`/entities/${entityId}/fields/${fieldId}`),

  create: (entityId: string, payload: FieldCreatePayload) =>
    axiosClient.post<Field>(`/entities/${entityId}/fields`, payload),

  update: (entityId: string, fieldId: string, payload: Partial<FieldCreatePayload>) =>
    axiosClient.put<Field>(`/entities/${entityId}/fields/${fieldId}`, payload),

  delete: (entityId: string, fieldId: string) =>
    axiosClient.delete(`/entities/${entityId}/fields/${fieldId}`),

  reorder: (entityId: string, fieldIds: string[]) =>
    axiosClient.post(`/entities/${entityId}/fields/reorder`, { fieldIds }),
};
