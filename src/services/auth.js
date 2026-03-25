import { http } from "./http";

/**
 * Decodifica el payload de un JWT sin usar librerías externas.
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
const saveAuthData = (token) => {
  localStorage.setItem("authToken", token);

  const decoded = decodeToken(token);
  if (decoded) {
    const user = {
      _id: decoded.userId || decoded.id,
      displayName: decoded.displayName,
      role: decoded.role,
      email: decoded.email,
    };
    localStorage.setItem("userData", JSON.stringify(user));
    return user;
  }
  return null;
};

/**
 * Registra un nuevo usuario.
 */
export const register = async (userData) => {
  try {
    const response = await http.post("/auth/register", userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return { success: false, error: error.response?.data?.message || "Error al registrar" };
  }
};

/**
 * Inicia sesión de un usuario.
 */
export const login = async (email, password) => {
  try {
    const response = await http.post("/auth/login", { email, password });
    const { token } = response.data;
    if (token) {
      const user = saveAuthData(token);
      return { success: true, user };
    }
    return { success: false, error: "Token no recibido" };
  } catch (error) {
    console.error("Error al iniciar sesión del usuario", error);
    return { success: false, error: error.response?.data?.message || "Error de credenciales" };
  }
};

/**
 * Refresca el token de acceso.
 */
export const refresh = async () => {
  try {
    const response = await http.post("/auth/refresh");
    const { token } = response.data;

    if (token) {
      saveAuthData(token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error al refrescar el token", error);
    logout();
    return null;
  }
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = async () => {
  try {
    await http.post("/auth/logout");
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }
};

/**
 * Obtiene el usuario actual desde localStorage.
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

/**
 * Verifica si hay un token de autenticación.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

/**
 * Verifica disponibilidad de email.
 */
export const checkEmail = async (email) => {
  try {
    const response = await http.get(`/auth/check-email?email=${email}`);
    return response.data.taken;
  } catch (error) {
    console.error("Error al consultar la disponibilidad del email", error);
    return null;
  }
};
