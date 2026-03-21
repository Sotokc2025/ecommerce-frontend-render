import { http } from "./http";

/**
 * Obtiene todas las categorías.
 */
export const fetchCategories = async () => {
  try {
    const response = await http.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
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
    console.error("Error fetching category by id", error);
    return null;
  }
};

/**
 * Busca categorías por término de búsqueda.
 */
export const searchCategories = async (query) => {
  try {
    const response = await http.get(`/categories/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching categories", error);
    return [];
  }
};

/**
 * Obtiene productos de una categoría específica.
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await http.get(`/products/category/${categoryId}`);
    return response.data.products || response.data || [];
  } catch (error) {
    console.error("Error fetching products by category", error);
    return [];
  }
};

/**
 * Obtiene productos de una categoría incluyendo sus subcategorías.
 */
export const getProductsByCategoryAndChildren = async (categoryId) => {
  try {
    const allCategories = await fetchCategories();
    const category = allCategories.find((cat) => (cat._id === categoryId || cat.id === categoryId));
    if (!category) return [];

    const childCategoryIds = allCategories
      .filter((cat) => (cat.parentCategory === categoryId || cat.parentCategory?._id === categoryId))
      .map((cat) => cat._id);

    const allCategoryIds = [categoryId, ...childCategoryIds];
    const response = await http.get("/products");
    
    // Extraemos el array de productos del objeto { products, pagination }
    const allProducts = response.data.products || response.data || [];

    return allProducts.filter((product) => {
      const prodCatId = product.category?._id || product.category?.id || product.category;
      return allCategoryIds.includes(prodCatId);
    });
  } catch (error) {
    console.error("Error fetching products by category and children", error);
    return [];
  }
};
