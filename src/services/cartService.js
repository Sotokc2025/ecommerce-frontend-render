import { http } from "./http";

/**
 * Obtiene el carrito del usuario.
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
 */
export const addToCart = async (productId, quantity) => {
  try {
    const response = await http.post("/cart/add-product", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart", error);
    return null;
  }
};

/**
 * Actualiza la cantidad de un producto en el carrito.
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
 */
export const removeToCart = async (productId) => {
  try {
    const response = await http.delete(`/cart/remove-item/${productId}`);
    return response.data;
  } catch (error) {
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
  } catch (error) {
    console.error("Error clearing cart", error);
    return null;
  }
};
