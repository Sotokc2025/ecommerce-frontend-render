import { fetchWithCache } from "../utils/apiCache";
import { http } from "./http";

export const getUserWishList = async () => {
  try {
    const response = await http.get("/wishList");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener wishlist: ${error.message}`);
  }
};

export const addToWishList = async (productId) => {
  try {
    const response = await http.post("/wishList/add", { productId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error agregando a wishlist: ${error.message}`);
  }
};

export const removeFromWishList = async (productId) => {
  try {
    const response = await http.delete(`/wishList/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error removiendo de wishlist: ${error.message}`);
  }
};
// ... existing code ...

export const checkProductInWishList = async (productId) => {
  // Usamos un TTL de 30 segundos para la wishlist para que sea fluido pero no sature.
  return fetchWithCache(`/wishList/check/${productId}`, {}, 30000);
};

export const moveToCart = async (productId) => {
  try {
    const response = await http.post("/wishList/move-to-cart", { productId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error moviendo a carrito: ${error.message}`);
  }
};

export const clearWishList = async () => {
  try {
    const response = await http.delete("/wishList/clear");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error vaciando wishlist: ${error.message}`);
  }
};
