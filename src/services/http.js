import axios from "axios";
const APP_BASE_URL = process.env.REACT_APP_API_BASE_URL;

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

export const http = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refresh } = await import("./auth");
        const newToken = await refresh();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      } catch (error) {
        console.error("Error en refresh token", error);
      }

      if (logoutCallback) logoutCallback();
    }

    // Manejo de 403 Forbidden: Usualmente indica un token inválido o sin permisos.
    // Si recibimos un 403 en una ruta que requiere auth, y no es un re-intento, 
    // es probable que nuestra sesión sea inválida (ej. cambio de secreto en servidor).
    if (error.response?.status === 403 && !originalRequest._retry) {
      console.error("Acceso prohibido (403). Forzando cierre de sesión.");
      if (logoutCallback) logoutCallback();
    }

    return Promise.reject(error);
  },
);
