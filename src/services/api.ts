import ApiFactory from "@/fetcher/ApiFactory";
import Http from "@/fetcher/http";

// API base URL
const API_BASE_URL = "http://192.168.1.23:3000/api";

// Singleton API instance
const api: Http = ApiFactory.createApiFactory("Fetch", API_BASE_URL);

// Update token when it changes
export const updateAuthToken = () => {
  const token = localStorage.getItem("authToken");
  api.updateHeaders({
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  });
};

updateAuthToken();

export default api;