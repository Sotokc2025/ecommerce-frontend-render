import { fetchWithCache } from "../utils/apiCache";

/**
 * Obtiene todos los productos desde el Backend (con paginación).
 * Devuelve el array plano de productos para mantener compatibilidad con los componentes del FE.
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Resultados por página (default: 50)
 */
export const fetchProducts = async (page = 1, limit = 50) => {
  const data = await fetchWithCache(`/products?page=${page}&limit=${limit}`);
  // El BE devuelve { products, pagination }; retornamos solo el array
  return data.products ?? data;
};

/**
 * Obtiene los productos más vendidos desde el Backend.
 * @param {number} limit - Cantidad de productos a mostrar (default: 12)
 */
export const fetchBestSellers = async (limit = 12) => {
  return fetchWithCache(`/products/bestsellers?limit=${limit}`);
};

/**
 * Busca productos por nombre o descripción using el endpoint de búsqueda del BE.
 * @param {string} query - Texto a buscar
 */
export const searchProducts = async (query) => {
  const params = new URLSearchParams({ q: query.trim() });
  const data = await fetchWithCache(`/products/search?${params.toString()}`);
  return data.products ?? data;
};

/**
 * Obtiene productos filtrados por categoría.
 * @param {string} categoryId - ID de la categoría (MongoDB ObjectId)
 */
export const getProductsByCategory = async (categoryId) => {
  const data = await fetchWithCache(`/products/category/${categoryId}`);
  // El endpoint /category/:id devuelve un array plano
  return Array.isArray(data) ? data : data.products ?? [];
};

/**
 * Obtiene un producto por su ID.
 * @param {string} id - ID del producto (MongoDB ObjectId)
 */
export async function getProductById(id) {
  try {
    return await fetchWithCache(`/products/${id}`);
  } catch (error) {
    if (error.response?.status === 404) return undefined;
    throw error;
  }
}
