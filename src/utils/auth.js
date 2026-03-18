const API_URL = "http://localhost:3000/api";

/**
 * Función para iniciar sesión real conectada al backend.
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "Error al iniciar sesión";
      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map(err => err.msg).join(", ");
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    // El backend devuelve { token, refreshToken }
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Decodificar el ID del usuario del JWT (segmento 1 en Base64)
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    const user = {
      _id: payload.userId,
      displayName: payload.displayName,
      email,
      role: payload.role
    };
    localStorage.setItem("userData", JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

/**
 * Función para registrar un nuevo usuario en el backend.
 */
export async function register(displayName, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "Error en el registro";
      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map(err => err.msg).join(", ");
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

// Función para cerrar sesión
export function logout() {
  localStorage.removeItem("authToken"); // Elimina el token
  localStorage.removeItem("userData"); // Elimina los datos del usuario
}

// Obtiene el usuario actual desde localStorage
export function getCurrentUser() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

// Verifica si el usuario está autenticado
export function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  return token !== null;
}