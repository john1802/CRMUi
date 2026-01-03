const TOKEN_KEY = 'crm_token';
const TENANT_KEY = 'crm_tenant_id';

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getTenantId: (): string | null => {
    return localStorage.getItem(TENANT_KEY);
  },

  setTenantId: (tenantId: string): void => {
    localStorage.setItem(TENANT_KEY, tenantId);
  },

  removeTenantId: (): void => {
    localStorage.removeItem(TENANT_KEY);
  },

  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TENANT_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
