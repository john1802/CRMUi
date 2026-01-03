export interface RoleMetadata {
    description?: string;
    level?: number;
}

export interface Role {
    id: string;
    name: string;
    metadata: RoleMetadata;
}

export interface RoleCreatePayload {
    name: string;
    metadata: RoleMetadata;
}

export interface RoleUpdatePayload {
    name: string;
    metadata: RoleMetadata;
}
