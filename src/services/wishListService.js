import { http } from "./http";

/**
 * Obtiene la lista de deseos del usuario.
 */
export const getWishList = async () => {
  try {
    const response = await http.get("/wishlist");
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist", error);
    return { items: [] };
  }
};

/**
 * Alias para getWishList para compatibilidad.
 */
export const getUserWishList = getWishList;

/**
 * Agrega un producto a la lista de deseos.
 */
export const addToWishList = async (productId) => {
  try {
    const response = await http.post("/wishlist/add", { productId });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist", error);
    return null;
  }
};

/**
 * Elimina un producto de la lista de deseos.
 */
export const removeFromWishList = async (productId) => {
  try {
    const response = await http.delete(`/wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist", error);
    return null;
  }
};

/**
 * Verifica si un producto está en la lista de deseos.
 * Retorna un booleano directamente para simplicidad y compatibilidad.
 */
export const isInWishList = async (productId) => {
  try {
    const response = await http.get(`/wishlist/check/${productId}`);
    // El backend devuelve { inWishlist: true/false }
    // Retornamos el booleano directamente para que el componente no falle al leer propiedades
    return !!(response.data.inWishlist ?? response.data.inWishList ?? response.data);
  } catch (error) {
    console.error("Error checking wishlist", error);
    return false;
  }
};

/**
 * Alias para isInWishList para compatibilidad.
 */
export const checkProductInWishList = isInWishList;
