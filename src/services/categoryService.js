import { http } from "./http";

/**
 * Obtiene todas las categorías desde el Backend.
 */
export const fetchCategories = async () => {
  try {
    const response = await http.get("/categories");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener categorías: ${error.message}`);
  }
};

/**
 * Obtiene todos los productos (usando el endpoint del backend).
 * Nota: Es preferible usar fetchProducts de productService.js, pero mantenemos esta aquí por compatibilidad.
 */
export const fetchProducts = async () => {
  try {
    const response = await http.get("/products");
    return response.data.products || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener productos: ${error.message}`);
  }
};

/**
 * Busca categorías por nombre o descripción.
 * @param {string} query - Texto a buscar
 */
export const searchCategories = async (query) => {
  const params = new URLSearchParams({ q: query.trim() });
  try {
    const response = await http.get(`/categories/search?${params.toString()}`);
    return response.data.categories || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error en búsqueda de categorías: ${error.message}`);
  }
};

/**
 * Obtiene una categoría por su ID.
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await http.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw new Error(error.response?.data?.message || `Error al obtener categoría: ${error.message}`);
  }
};

/**
 * Obtiene las categorías hijas de una categoría. 
 * El backend no tiene un endpoint específico, así que filtramos el total por ahora.
 */
export const getChildCategories = async (parentCategoryId) => {
  const allCategories = await fetchCategories();
  return allCategories.filter((cat) =>
    (cat.parentCategory === parentCategoryId) ||
    (cat.parentCategory?._id === parentCategoryId)
  );
};

/**
 * Obtiene productos por categoría específica.
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await http.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener productos por categoría: ${error.message}`);
  }
};

/**
 * Obtiene productos de una categoría incluyendo sus subcategorías.
 */
export const getProductsByCategoryAndChildren = async (categoryId) => {
  const allCategories = await fetchCategories();

  // Busca la categoría principal
  const category = allCategories.find((cat) => (cat._id === categoryId || cat.id === categoryId));
  if (!category) return [];

  // Obtiene los IDs de todas las categorías hijas
  const childCategoryIds = allCategories
    .filter((cat) => (cat.parentCategory === categoryId || cat.parentCategory?._id === categoryId))
    .map((cat) => cat._id);

  const allCategoryIds = [categoryId, ...childCategoryIds];

  // Obtenemos todos los productos y filtramos
  const allProducts = await fetchProducts();

  // Retorna productos de la categoría padre y sus hijas
  return allProducts.filter((product) => {
    const prodCatId = product.category?._id || product.category?.id || product.category;
    return allCategoryIds.includes(prodCatId);
  });
};

/**
 * Obtiene categorías principales (sin padre).
 */
export const getParentCategories = async () => {
  const allCategories = await fetchCategories();
  return allCategories.filter((cat) => !cat.parentCategory);
};
