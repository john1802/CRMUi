import { Role } from '../types/role';

export interface RoleListState {
    roles: Role[];
    isLoading: boolean;
    error: string | null;
    openDrawer: boolean;
    editingRole: Role | null;
    // Form state
    formValues: {
        name: string;
        description: string;
        level: string; // Handle as string for input, convert to number on save
    };
    searchQuery: string;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    };
}

export type RoleListAction =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: Role[] }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'OPEN_CREATE_DRAWER' }
    | { type: 'OPEN_EDIT_DRAWER'; payload: Role }
    | { type: 'CLOSE_DRAWER' }
    | { type: 'UPDATE_FORM'; field: keyof RoleListState['formValues']; value: string }
    | { type: 'RESET_FORM' }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SHOW_SNACKBAR'; payload: { message: string; severity?: 'success' | 'error' | 'info' | 'warning' } }
    | { type: 'HIDE_SNACKBAR' };

export const initialState: RoleListState = {
    roles: [],
    isLoading: false,
    error: null,
    openDrawer: false,
    editingRole: null,
    formValues: { name: '', description: '', level: '1' },
    searchQuery: '',
    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
};

export const roleListReducer = (state: RoleListState, action: RoleListAction): RoleListState => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, roles: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'OPEN_CREATE_DRAWER':
            return {
                ...state,
                openDrawer: true,
                editingRole: null,
                formValues: { name: '', description: '', level: '1' },
            };
        case 'OPEN_EDIT_DRAWER':
            const metadata = typeof action.payload.metadata === 'string'
                ? JSON.parse(action.payload.metadata as unknown as string)
                : action.payload.metadata || {};

            return {
                ...state,
                openDrawer: true,
                editingRole: action.payload,
                formValues: {
                    name: action.payload.name,
                    description: metadata.description || '',
                    level: (metadata.level || 1).toString(),
                },
            };
        case 'CLOSE_DRAWER':
            return {
                ...state,
                openDrawer: false,
                editingRole: null,
                formValues: { name: '', description: '', level: '1' },
            };
        case 'UPDATE_FORM':
            return {
                ...state,
                formValues: { ...state.formValues, [action.field]: action.value },
            };
        case 'RESET_FORM':
            return {
                ...state,
                formValues: { name: '', description: '', level: '1' },
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
        default:
            return state;
    }
};
