// @ts-check
import { http } from "./http";

/**
 * Obtiene el perfil del usuario actual.
 */
export const getUserProfile = async () => {
  try {
    const response = await http.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }
};

/**
 * Actualiza el perfil del usuario.
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await http.put("/users/profile", userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile", error);
    return null;
  }
};

/**
 * Cambia la contraseña del usuario.
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await http.post("/users/change-password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error changing password", error);
    return null;
  }
};
