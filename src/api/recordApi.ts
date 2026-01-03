import axiosClient from './axiosClient';
import { Record, RecordCreatePayload, RecordUpdatePayload } from '../types/record';

export const RecordApi = {
  getByEntity: (entityId: string, params?: { page?: number; limit?: number; search?: string }) =>
    axiosClient.get<{ records: Record[]; total: number }>(`/entities/${entityId}/records`, { params }),

  getById: (entityId: string, recordId: string) =>
    axiosClient.get<Record>(`/entities/${entityId}/records/${recordId}`),

  create: (entityId: string, payload: RecordCreatePayload) =>
    axiosClient.post<Record>(`/entities/${entityId}/records`, payload),

  update: (entityId: string, recordId: string, payload: RecordUpdatePayload) =>
    axiosClient.put<Record>(`/entities/${entityId}/records/${recordId}`, payload),

  delete: (entityId: string, recordId: string) =>
    axiosClient.delete(`/entities/${entityId}/records/${recordId}`),

  bulkDelete: (entityId: string, recordIds: string[]) =>
    axiosClient.post(`/entities/${entityId}/records/bulk-delete`, { recordIds }),
};
