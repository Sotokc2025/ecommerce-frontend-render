/**
 * Servicio para gestionar la persistencia del carrito en el Backend.
 * Sigue el protocolo SSDLC y usa Fetch API.
 */

import { http } from "./http";

/**
 * Obtiene el carrito del usuario autenticado.
 * @param {string} userId - ID del usuario.
 */
export const fetchCart = async (userId) => {
  try {
    const response = await http.get(`/cart/user/${userId}`);
    return response.data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener el carrito: ${error.message}`);
  }
};

/**
 * Agrega un producto al carrito en el servidor.
 * @param {string} productId - ID del producto.
 * @param {number} quantity - Cantidad a agregar.
 */
export const addProductToRemoteCart = async (productId, quantity = 1) => {
  try {
    const response = await http.post("/cart/add-product", { productId, quantity });
    return response.data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al agregar producto al carrito remoto");
  }
};

/**
 * Actualiza la cantidad de un producto en el servidor.
 * @param {string} productId - ID del producto.
 * @param {number} quantity - Nueva cantidad.
 */
export const updateRemoteCartItem = async (productId, quantity) => {
  try {
    const response = await http.put("/cart/update-item", { productId, quantity });
    return response.data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar item en el servidor");
  }
};

/**
 * Elimina un producto del carrito en el servidor.
 * @param {string} productId - ID del producto.
 */
export const removeRemoteCartItem = async (productId) => {
  try {
    const response = await http.delete(`/cart/remove-item/${productId}`);
    return response.data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar item del servidor");
  }
};

/**
 * Vacía el carrito en el servidor.
 */
export const clearRemoteCart = async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?._id || userData?.id;

  try {
    const response = await http.post("/cart/clear", { userId });
    return response.data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al vaciar el carrito en el servidor");
  }
};
