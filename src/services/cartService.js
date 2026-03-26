// @ts-check
import { http } from "./http";
/**
 * Obtiene el carrito del usuario.
 * @param {string} userId
 */
export const getCart = async (userId) => {
  try {
    const response = await http.get(`/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching a cart", error);
    return null;
  }
};
/**
 * Agrega un producto al carrito.
 * @param {string} productId
 * @param {number} quantity
 */
export const addToCart = async (productId, quantity) => {
  try {
    const response = await http.post("/cart/add-product", {
      productId,
      quantity,
    });
    return response.data;
  }
  catch (error) {
    console.error("Error adding to cart", error);
    return null;
  }
};
/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {string} productId
 * @param {number} quantity
 */
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await http.put("/cart/update-item", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item", error);
    return null;
  }
};
/**
 * Elimina un producto del carrito.
 * @param {string} productId
 */
export const removeToCart = async (productId) => {
  try {
    const response = await http.delete(`/cart/remove-item/${productId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error removing from cart", error);
    return null;
  }
};
/**
 * Vacía el carrito del usuario.
 */
export const clearCart = async () => {
  try {
    const response = await http.post("/cart/clear");
    return response.data;
  }
  catch (error) {
    console.error("Error clearing cart", error);
    return null;
  }
};
/**
 * Sincroniza el carrito completo (Idempotente).
 * @param {Array<{productId: string, quantity: number}>} products
 */
export const syncCart = async (products) => {
  try {
    const response = await http.post("/cart/sync", { products });
    return response.data;
  }
  catch (error) {
    console.error("Error syncing cart", error);
    return null;
  }
};
