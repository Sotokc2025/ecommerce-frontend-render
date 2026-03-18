// URL base del Backend
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene todos los usuarios desde el Backend (solo Admin).
 */
export const fetchUsers = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener usuarios: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  // El BE devuelve { message, pagination, users }; retornamos solo el array
  return data.users || data;
};

/**
 * Busca usuarios por nombre o email (solo Admin).
 * @param {string} query - Texto a buscar
 */
export const searchUsers = async (query) => {
  const token = localStorage.getItem("authToken");
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`${API_BASE_URL}/users/search?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error en búsqueda de usuarios: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.users || data;
};

/**
 * Obtiene un usuario por su ID (solo Admin).
 * @param {string} userId - ID del usuario (MongoDB ObjectId)
 */
export const getUserById = async (userId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Error al obtener usuario: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.user || data;
};

/**
 * Obtiene el perfil del usuario autenticado actualmente.
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener perfil: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.user || data;
};
