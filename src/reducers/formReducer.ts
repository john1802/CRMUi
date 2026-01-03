export interface FormState<T> {
  values: T;
  errors: Partial<{ [K in keyof T]: string }>;
  touched: Partial<{ [K in keyof T]: boolean }>;
  isSubmitting: boolean;
  isValid: boolean;
}

export type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: unknown }
  | { type: 'SET_ERROR'; field: keyof T; error: string }
  | { type: 'CLEAR_ERROR'; field: keyof T }
  | { type: 'SET_TOUCHED'; field: keyof T }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET'; initialValues: T }
  | { type: 'SET_VALUES'; values: Partial<T> }
  | { type: 'VALIDATE'; isValid: boolean };

export const createFormInitialState = <T>(initialValues: T): FormState<T> => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true,
});

export const formReducer = <T>(state: FormState<T>, action: FormAction<T>): FormState<T> => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
        isValid: false,
      };
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'RESET':
      return createFormInitialState(action.initialValues);
    case 'SET_VALUES':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values,
        },
      };
    case 'VALIDATE':
      return {
        ...state,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};
