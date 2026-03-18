// URL base del Backend
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene todos los productos desde el Backend (con paginación).
 * Devuelve el array plano de productos para mantener compatibilidad con los componentes del FE.
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Resultados por página (default: 50)
 */
export const fetchProducts = async (page = 1, limit = 50) => {
  const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  // El BE devuelve { products, pagination }; retornamos solo el array
  return data.products ?? data;
};

/**
 * Obtiene los productos más vendidos desde el Backend.
 * @param {number} limit - Cantidad de productos a mostrar (default: 12)
 */
export const fetchBestSellers = async (limit = 12) => {
  const response = await fetch(`${API_BASE_URL}/products/bestsellers?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Error al obtener los más vendidos: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Busca productos por nombre o descripción using el endpoint de búsqueda del BE.
 * @param {string} query - Texto a buscar
 */
export const searchProducts = async (query) => {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Error en búsqueda de productos: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.products ?? data;
};

/**
 * Obtiene productos filtrados por categoría.
 * @param {string} categoryId - ID de la categoría (MongoDB ObjectId)
 */
export const getProductsByCategory = async (categoryId) => {
  const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos por categoría: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  // El endpoint /category/:id devuelve un array plano
  return Array.isArray(data) ? data : data.products ?? [];
};

/**
 * Obtiene un producto por su ID.
 * @param {string} id - ID del producto (MongoDB ObjectId)
 */
export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error(`Error al obtener producto: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
