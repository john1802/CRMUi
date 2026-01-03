import { User } from '../types/user';
import { Role } from '../types/role';

export interface UserListState {
    users: User[];
    roles: Role[];
    isLoading: boolean;
    error: string | null;
    openDrawer: boolean;
    editingUser: User | null;
    // Form state
    formValues: {
        email: string;
        name: string;
        password: string;
        roleId: string;
    };
    searchQuery: string;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    };
}

export type UserListAction =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: User[] }
    | { type: 'FETCH_ROLES_SUCCESS'; payload: Role[] }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'OPEN_CREATE_DRAWER' }
    | { type: 'OPEN_EDIT_DRAWER'; payload: User }
    | { type: 'CLOSE_DRAWER' }
    | { type: 'UPDATE_FORM'; field: keyof UserListState['formValues']; value: string }
    | { type: 'RESET_FORM' }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SHOW_SNACKBAR'; payload: { message: string; severity?: 'success' | 'error' | 'info' | 'warning' } }
    | { type: 'HIDE_SNACKBAR' }
    | { type: 'UPDATE_USER_STATUS'; payload: { id: string; isActive: boolean } }
    | { type: 'ADD_USER'; payload: User }
    | { type: 'UPDATE_USER'; payload: User };

export const initialState: UserListState = {
    users: [],
    roles: [],
    isLoading: false,
    error: null,
    openDrawer: false,
    editingUser: null,
    formValues: { email: '', name: '', password: '', roleId: '' },
    searchQuery: '',
    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
};

export const userListReducer = (state: UserListState, action: UserListAction): UserListState => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, users: action.payload, error: null };
        case 'FETCH_ROLES_SUCCESS':
            return { ...state, roles: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        // ... (existing cases) ...
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
            };
        case 'OPEN_CREATE_DRAWER':
            return {
                ...state,
                openDrawer: true,
                editingUser: null,
                formValues: { email: '', name: '', password: '', roleId: '' },
            };
        case 'OPEN_EDIT_DRAWER':
            return {
                ...state,
                openDrawer: true,
                editingUser: action.payload,
                formValues: {
                    email: action.payload.email,
                    name: action.payload.name,
                    password: '', // Password is never populated on edit
                    roleId: action.payload.roleId,
                },
            };
        case 'CLOSE_DRAWER':
            return {
                ...state,
                openDrawer: false,
                editingUser: null,
                formValues: { email: '', name: '', password: '', roleId: '' },
                users: [...state.users], // Defensive copy to prevent mutation issues
            };
        case 'UPDATE_FORM':
            return {
                ...state,
                formValues: { ...state.formValues, [action.field]: action.value },
            };
        case 'RESET_FORM':
            return {
                ...state,
                formValues: { email: '', name: '', password: '', roleId: '' },
            };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        case 'SHOW_SNACKBAR':
            return {
                ...state,
                snackbar: {
                    open: true,
                    message: action.payload.message,
                    severity: action.payload.severity || 'success',
                },
            };
        case 'HIDE_SNACKBAR':
            return {
                ...state,
                snackbar: { ...state.snackbar, open: false },
            };
        case 'UPDATE_USER_STATUS':
            return {
                ...state,
                users: state.users.map((u) =>
                    u.id === action.payload.id ? { ...u, isActive: action.payload.isActive } : u
                ),
            };
        default:
            return state;
    }
};
