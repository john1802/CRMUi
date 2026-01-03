import { useReducer, useCallback, useEffect } from 'react';
import { authReducer, authInitialState, AuthState } from '../reducers/authReducer';
import { AuthApi, LoginPayload } from '../api/authApi';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    const token = storage.getToken();
    const tenantId = storage.getTenantId();
    if (token) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, tenantId: tenantId || undefined } });
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await AuthApi.login(payload);
      const { token, tenantId } = response.data;
      
      storage.setToken(token);
      if (tenantId) {
        storage.setTenantId(tenantId);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, tenantId } });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearAll();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return {
    ...state,
    login,
    logout,
    clearError,
  };
};

export type UseAuthReturn = AuthState & {
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};
