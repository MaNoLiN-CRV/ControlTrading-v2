import ApiFactory from "@/fetcher/ApiFactory";
import Http from "@/fetcher/http";

// API base URL
const API_BASE_URL = "http://localhost:3000/api";

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': ''
};

const getInitialToken = () => {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : '';
};

const api: Http = ApiFactory.createApiFactory(
  "Fetch", 
  API_BASE_URL,
  {
    ...defaultHeaders,
    'Authorization': getInitialToken()
  }
);

export const updateAuthToken = () => {
  const token = localStorage.getItem("authToken");
  api.updateHeaders({
    'Authorization': token ? `Bearer ${token}` : '',
  });
};

updateAuthToken();

export default api;