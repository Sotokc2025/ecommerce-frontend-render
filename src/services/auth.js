import { http } from "./http";

/**
 * Decodifica el payload de un JWT sin usar librerías externas.
 * @param {string} token - El token JWT.
 */
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

/**
 * Guarda el token y los datos del usuario en localStorage.
 */
const saveAuthData = (token, refreshToken) => {
  localStorage.setItem("authToken", token);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  
  const decoded = decodeToken(token);
  if (decoded) {
    const user = {
      _id: decoded.userId || decoded.id,
      displayName: decoded.displayName,
      role: decoded.role,
      email: decoded.email
    };
    localStorage.setItem("userData", JSON.stringify(user));
    return user;
  }
  return null;
};

export const register = async (userData) => {
  try {
    const response = await http.post("/auth/register", userData);
    const { displayName, email } = response.data;

    if (displayName && email) {
      return { success: true, email };
    } else {
      return { success: false, error: "Error en el formato de respuesta del servidor" };
    }
  } catch (error) {
    console.error("Error al registrar un usuario", error.message, userData);
    return { success: false, error: error.response?.data?.message || "Error de conexión" };
  }
};

export const login = async (email, password) => {
  try {
    const response = await http.post("/auth/login", { email, password });
    const { token, refreshToken } = response.data;
    if (token) {
      const user = saveAuthData(token, refreshToken);
      return { success: true, user };
    } else {
      return { success: false, error: "Token no recibido" };
    }
  } catch (error) {
    console.error("Error al iniciar sesión del usuario", error.message, email);
    return { success: false, error: error.response?.data?.message || "Error de credenciales" };
  }
};

export const refresh = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await http.post("/auth/refresh", { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;

    if (token) {
      saveAuthData(token, newRefreshToken);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error al refrescar el token", error);
    logout(); // Si falla el refresh, forzamos logout
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  // Opcional: recargar la página para limpiar estados de memoria
  // window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

export const checkEmail = async (email) => {
  try {
    const response = await http.get(`/auth/check-email?email=${email}`);
    const { taken } = response.data;
    return taken;
  } catch (error) {
    console.error("Error al consultar la disponibilidad del email", error.message, email);
    return null;
  }
};
