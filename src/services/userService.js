import { http } from "./http";

/**
 * Obtiene todos los usuarios desde el Backend (solo Admin).
 */
export const fetchUsers = async () => {
  try {
    const response = await http.get("/users");
    // El BE devuelve { message, pagination, users }; retornamos solo el array
    return response.data.users || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener usuarios: ${error.message}`);
  }
};

/**
 * Busca usuarios por nombre o email (solo Admin).
 * @param {string} query - Texto a buscar
 */
export const searchUsers = async (query) => {
  const params = new URLSearchParams({ q: query.trim() });
  try {
    const response = await http.get(`/users/search?${params.toString()}`);
    return response.data.users || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error en búsqueda de usuarios: ${error.message}`);
  }
};

/**
 * Obtiene un usuario por su ID (solo Admin).
 * @param {string} userId - ID del usuario (MongoDB ObjectId)
 */
export const getUserById = async (userId) => {
  try {
    const response = await http.get(`/users/${userId}`);
    return response.data.user || response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw new Error(error.response?.data?.message || `Error al obtener usuario: ${error.message}`);
  }
};

/**
 * Obtiene el perfil del usuario autenticado actualmente.
 */
export const getUserProfile = async () => {
  try {
    const response = await http.get("/users/profile");
    return response.data.user || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener perfil: ${error.message}`);
  }
};
