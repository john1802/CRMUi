export interface Record {
  id: string;
  entityId: string;
  tenantId: string;
  data: { [key: string]: unknown };
  createdAt: string;
  updatedAt: string;
}

export interface RecordCreatePayload {
  data: { [key: string]: unknown };
}

export interface RecordUpdatePayload {
  data: { [key: string]: unknown };
}
