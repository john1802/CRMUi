export interface Entity {
  id: string;
  name: string;
  slug: string;
  configJson?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityCreatePayload {
  name: string;
  slug: string;
  configJson?: string;
}

export interface EntityUpdatePayload {
  name?: string;
  slug?: string;
  configJson?: string;
}
