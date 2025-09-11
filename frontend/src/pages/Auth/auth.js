// auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // 👈 from .env

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ✅ Create axios instance with env URL
export const api = axios.create({
  baseURL: API_URL,
});

export const getDecodedUser = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("🔑 Decoded JWT:", decoded); // 👈 debug log
    return decoded;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};

// ✅ Attach access token automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: getRefreshToken(),
        });

        const { access } = res.data;
        setTokens(access, getRefreshToken());

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
