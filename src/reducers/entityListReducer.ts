import { Entity } from '../types/entity';

export interface EntityListState {
    entities: Entity[];
    isLoading: boolean;
    error: string | null;
    openDrawer: boolean;
    editingEntity: Entity | null;
    // Form state
    formValues: {
        name: string;
        slug: string;
        configJson: string;
    };
    searchQuery: string;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    };
}

export type EntityListAction =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: Entity[] }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'OPEN_CREATE_DRAWER' }
    | { type: 'OPEN_EDIT_DRAWER'; payload: Entity }
    | { type: 'CLOSE_DRAWER' }
    | { type: 'UPDATE_FORM'; field: keyof EntityListState['formValues']; value: string }
    | { type: 'RESET_FORM' }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SHOW_SNACKBAR'; payload: { message: string; severity?: 'success' | 'error' | 'info' | 'warning' } }
    | { type: 'HIDE_SNACKBAR' };

export const initialState: EntityListState = {
    entities: [],
    isLoading: false, // Will set to true on mount effect
    error: null,
    openDrawer: false,
    editingEntity: null,
    formValues: { name: '', slug: '', configJson: '' },
    searchQuery: '',
    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
};

export const entityListReducer = (state: EntityListState, action: EntityListAction): EntityListState => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, entities: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'OPEN_CREATE_DRAWER':
            return {
                ...state,
                openDrawer: true,
                editingEntity: null,
                formValues: { name: '', slug: '', configJson: '' },
            };
        case 'OPEN_EDIT_DRAWER':
            return {
                ...state,
                openDrawer: true,
                editingEntity: action.payload,
                formValues: {
                    name: action.payload.name,
                    slug: action.payload.slug,
                    configJson: action.payload.configJson || '',
                },
            };
        case 'CLOSE_DRAWER':
            return {
                ...state,
                openDrawer: false,
                editingEntity: null,
                formValues: { name: '', slug: '', configJson: '' },
            };
        case 'UPDATE_FORM':
            return {
                ...state,
                formValues: { ...state.formValues, [action.field]: action.value },
            };
        case 'RESET_FORM':
            return {
                ...state,
                formValues: { name: '', slug: '', configJson: '' },
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
