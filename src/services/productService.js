// @ts-check
import { http } from "./http";

/**
 * Obtiene todos los productos con paginación opcional.
 * Retorna el array de productos para compatibilidad con los componentes.
 */
export const fetchProducts = async (page = 1, limit = 50) => {
  try {
    const response = await http.get(`/products?page=${page}&limit=${limit}`);
    // El backend devuelve { products: [], pagination: {} }
    return response.data.products || response.data || [];
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
};

/**
 * Obtiene un producto por su ID.
 */
export const getProductById = async (productId) => {
  try {
    const response = await http.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id", error);
    return null;
  }
};

/**
 * Obtiene los productos más vendidos.
 */
export const fetchBestSellers = async (limit = 12) => {
  try {
    const response = await http.get(`/products/bestsellers?limit=${limit}`);
    // Si el backend devuelve un objeto con una propiedad, la extraemos, si no, el array directo
    return response.data.products || response.data || [];
  } catch (error) {
    console.error("Error fetching best sellers", error);
    return [];
  }
};

/**
 * Busca productos por término de búsqueda.
 */
export const searchProducts = async (query) => {
  try {
    const response = await http.get(`/products/search?q=${query}`);
    return response.data.products || response.data || [];
  } catch (error) {
    console.error("Error searching products", error);
    return [];
  }
};

/**
 * Crea un producto (requiere rol de admin).
 * Acepta FormData para permitir subida de imágenes (Multer/Cloudinary).
 */
export const createProduct = async (productFormData) => {
  try {
    // Axios automáticamente configura el multipart/form-data boundary al recibir un FormData
    const response = await http.post("/products", productFormData);
    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
    throw error;
  }
};
