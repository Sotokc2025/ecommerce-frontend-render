// URL base del Backend
const API_BASE_URL = 'http://localhost:3000/api';

export const getUserWishList = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error al obtener wishlist: ${response.status}`);
  return response.json();
};

export const addToWishList = async (productId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Error agregando a wishlist: ${response.status}`);
  }
  return response.json();
};

export const removeFromWishList = async (productId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList/remove/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error removiendo de wishlist: ${response.status}`);
  return response.json();
};

export const checkProductInWishList = async (productId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList/check/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Error verificando wishlist: ${response.status}`);
  }
  return response.json();
};

export const moveToCart = async (productId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList/move-to-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error(`Error moviendo a carrito: ${response.status}`);
  return response.json();
};

export const clearWishList = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/wishList/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error vaciando wishlist: ${response.status}`);
  return response.json();
};
