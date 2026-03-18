// URL base del Backend
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene las reviews de un producto
 * @param {string} productId
 */
export const getProductReviews = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/review/product/${productId}`);
  if (!response.ok) {
    throw new Error(`Error al obtener reviews: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.reviews || [];
};

export const createReview = async (payload) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Error creando review: ${response.status}`);
  }

  return response.json();
};

export const getMyReviews = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/my-reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error al obtener mis reviews: ${response.status}`);
  return response.json();
};

export const updateReview = async (reviewId, payload) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/review/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Error actualizando review: ${response.status}`);
  }
  return response.json();
};

export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/review/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error eliminando review: ${response.status}`);
  return response.json();
};
