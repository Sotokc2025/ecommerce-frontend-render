// URL base del Backend
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene todas las categorías desde el Backend.
 */
export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Error al obtener categorías: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Obtiene todos los productos (usando el endpoint del backend).
 * Nota: Es preferible usar fetchProducts de productService.js, pero mantenemos esta aquí por compatibilidad.
 */
export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.products || data;
};

/**
 * Busca categorías por nombre o descripción.
 * @param {string} query - Texto a buscar
 */
export const searchCategories = async (query) => {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`${API_BASE_URL}/categories/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Error en búsqueda de categorías: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.categories || data;
};

/**
 * Obtiene una categoría por su ID.
 */
export const getCategoryById = async (categoryId) => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Error al obtener categoría: ${response.status} ${response.statusText}`);
  }
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos por categoría: ${response.status} ${response.statusText}`);
  }
  return response.json();
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
