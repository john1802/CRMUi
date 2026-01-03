import axios from "axios";
import { storage } from "../utils/storage";

const DEFAULT_TENANT_ID = "587be5cc-f6a0-4dd2-ae42-483578dfa433";

const axiosClient = axios.create({
  baseURL: "https://localhost:7116/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantId = storage.getTenantId() || DEFAULT_TENANT_ID;
    if (config.headers) {
      config.headers["X-Tenant-Id"] = tenantId;
    }
    console.debug('API Request:', { endpoint: config.url, tenantId, hasToken: !!token });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
