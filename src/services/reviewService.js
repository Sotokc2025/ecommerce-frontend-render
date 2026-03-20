import { http } from "./http";

export const getProductReviews = async (productId) => {
  try {
    const response = await http.get(`/review/product/${productId}`);
    return response.data.reviews || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener reviews: ${error.message}`);
  }
};

export const createReview = async (payload) => {
  try {
    const response = await http.post("/review", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error creando review: ${error.message}`);
  }
};

export const getMyReviews = async () => {
  try {
    const response = await http.get("/my-reviews");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener mis reviews: ${error.message}`);
  }
};

export const updateReview = async (reviewId, payload) => {
  try {
    const response = await http.put(`/review/${reviewId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error actualizando review: ${error.message}`);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await http.delete(`/review/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error eliminando review: ${error.message}`);
  }
};
