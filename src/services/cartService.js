/**
 * Servicio para gestionar la persistencia del carrito en el Backend.
 * Sigue el protocolo SSDLC y usa Fetch API.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene los headers de autorización con el token actual.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Obtiene el carrito del usuario autenticado.
 * @param {string} userId - ID del usuario.
 */
export const fetchCart = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/cart/user/${userId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error al obtener el carrito: ${response.status}`);
  }

  const data = await response.json();
  return data.cart;
};

/**
 * Agrega un producto al carrito en el servidor.
 * @param {string} productId - ID del producto.
 * @param {number} quantity - Cantidad a agregar.
 */
export const addProductToRemoteCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart/add-product`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al agregar producto al carrito remoto");
  }

  const data = await response.json();
  return data.cart;
};

/**
 * Actualiza la cantidad de un producto en el servidor.
 * @param {string} productId - ID del producto.
 * @param {number} quantity - Nueva cantidad.
 */
export const updateRemoteCartItem = async (productId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/update-item`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar item en el servidor");
  }

  const data = await response.json();
  return data.cart;
};

/**
 * Elimina un producto del carrito en el servidor.
 * @param {string} productId - ID del producto.
 */
export const removeRemoteCartItem = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/cart/remove-item/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar item del servidor");
  }

  const data = await response.json();
  return data.cart;
};

/**
 * Vacía el carrito en el servidor.
 */
export const clearRemoteCart = async () => {
  // Nota: El backend espera userId en el body según la ruta, 
  // aunque el controlador lo extrae de req.user.userId. 
  // Enviamos un objeto vacío por compatibilidad con la validación de ruta si fuera necesaria.
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?._id || userData?.id;

  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al vaciar el carrito en el servidor");
  }

  const data = await response.json();
  return data.cart;
};
