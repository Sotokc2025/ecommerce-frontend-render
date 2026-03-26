// @ts-check
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
  withCredentials: true,
  timeout: 8000,
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
// Inyecta el token JWT en cada petición saliente de forma automática.
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── 401 Unauthorized: Intenta refrescar el token una sola vez ──────────
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refresh } = await import("./auth");
        const newToken = await refresh();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error al refrescar token:", refreshError);
      }
      // Si el refresh falla, cierra la sesión
      if (logoutCallback) logoutCallback();
    }

    // ── 403 Forbidden: Token inválido o sin permisos, cerrar sesión ─────────
    if (status === 403 && !originalRequest._retry) {
      console.error("Acceso prohibido (403). Forzando cierre de sesión.");
      if (logoutCallback) logoutCallback();
    }

    // ── 5xx Server Errors: Notifica globalmente sin romper el flujo ─────────
    if (status && status >= 500) {
      console.error(`Error del servidor (${status}):`, error.response?.data);
      // Despacha un evento DOM personalizado para que los componentes de UI
      // puedan mostrar un toast sin acoplarse directamente al interceptor.
      window.dispatchEvent(
        new CustomEvent("app:server-error", {
          detail: {
            status,
            message:
              error.response?.data?.message ||
              "Error interno del servidor. Intenta de nuevo más tarde.",
          },
        })
      );
    }

    // ── Network Error: Sin conexión al servidor ──────────────────────────────
    if (!error.response && error.message === "Network Error") {
      window.dispatchEvent(
        new CustomEvent("app:server-error", {
          detail: {
            status: 0,
            message: "Sin conexión con el servidor. Verifica tu red.",
          },
        })
      );
    }

    return Promise.reject(error);
  },
);

export default http;

