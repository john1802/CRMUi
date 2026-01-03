export interface User {
    id: string;
    email: string;
    name: string;
    roleId: string;
    isActive: boolean;
    createdAt: string;
}

export interface UserCreatePayload {
    email: string;
    name: string;
    password: string; // Only sent during create
    roleId: string;
}

export interface UserUpdatePayload {
    name: string;
    roleId: string;
}

export interface UserStatusPayload {
    isActive: boolean;
}
