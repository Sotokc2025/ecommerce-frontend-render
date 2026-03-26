// @ts-check
import { http } from "./http";

/**
 * Obtiene las reseñas de un producto.
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await http.get(`/review/product/${productId}`);
    return response.data.reviews || response.data || [];
  } catch (error) {
    console.error("Error fetching product reviews", error);
    return [];
  }
};

/**
 * Agrega una reseña a un producto.
 */
export const addReview = async (reviewData) => {
  try {
    const response = await http.post("/review", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review", error);
    throw error; // Re-lanzamos para que el componente maneje el error
  }
};

/**
 * Alias para addReview para compatibilidad.
 */
export const createReview = addReview;

/**
 * Obtiene las reseñas del usuario actual.
 */
export const getUserReviews = async () => {
  try {
    const response = await http.get("/my-reviews");
    return response.data.reviews || response.data || [];
  } catch (error) {
    console.error("Error fetching user reviews", error);
    return [];
  }
};

/**
 * Obtiene el promedio de calificación de un producto.
 */
export const getProductRating = async (productId) => {
  try {
    const reviews = await getProductReviews(productId);
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, br) => acc + br.rating, 0);
    const average = (sum / reviews.length).toFixed(1);
    return { average: parseFloat(average), count: reviews.length };
  } catch (error) {
    console.error("Error calculating product rating", error);
    return { average: 0, count: 0 };
  }
};
