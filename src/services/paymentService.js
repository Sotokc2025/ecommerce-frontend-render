// @ts-check
import { http } from "./http";

/**
 * Obtiene los métodos de pago del usuario autenticado.
 * Usa el endpoint /me para evitar errores de permisos (403).
 */
export const getPaymentMethods = async () => {
  try {
    const response = await http.get("/payment-methods/me");
    // El backend devuelve { message, count, paymentMethods } o el array directamente
    return response.data.paymentMethods || response.data || [];
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Error fetching payment methods", error);
    return [];
  }
};

/**
 * Obtiene el método de pago por defecto.
 */
export const getDefaultPaymentMethod = async () => {
  try {
    const response = await http.get("/payment-methods/default");
    // El backend devuelve { message, paymentMethod } o { message, address } (según el controlador)
    // Importante: devolver null si no hay datos reales para evitar objetos "truthy" vacíos
    return response.data?.paymentMethod || response.data?.address || null;
  } catch (err) {
    const error = /** @type {any} */ (err);
    // No logueamos error para el default si es un 404 (común si no tiene ninguno)
    if (error.response?.status !== 404) {
      console.error("Error fetching default payment method", error);
    }
    return null;
  }
};

/**
 * Agrega un nuevo método de pago.
 * @param {any} paymentData Datos del método de pago
 */
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await http.post("/payment-methods", paymentData);
    // El backend devuelve { message, paymentMethod } o el objeto directamente
    return response.data?.paymentMethod || response.data;
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Error adding payment method", error);
    throw error;
  }
};

/**
 * Crea un método de pago (Alias para addPaymentMethod).
 */
export const createPaymentMethod = addPaymentMethod;

/**
 * Actualiza un método de pago.
 * @param {string} id ID del método
 * @param {any} paymentData Datos a actualizar
 */
export const updatePaymentMethod = async (id, paymentData) => {
  try {
    const response = await http.put(`/payment-methods/${id}`, paymentData);
    // El backend devuelve { message, paymentMethod } o el objeto directamente
    return response.data?.paymentMethod || response.data;
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Error updating payment method", error);
    throw error;
  }
};

/**
 * Elimina un método de pago.
 * @param {string} id ID del método
 */
export const deletePaymentMethod = async (id) => {
  try {
    const response = await http.delete(`/payment-methods/${id}`);
    return response.data;
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Error deleting payment method", error);
    throw error;
  }
};

/**
 * Crea una sesión de Checkout de Polar.sh para una orden específica.
 * @param {string} orderId El ID de la orden generada
 * @returns {Promise<{checkoutUrl: string, message?: string}>}
 */
export const createStripePaymentIntent = async (orderId) => {
  try {
    const response = await http.post("/payments/create-payment-intent", { orderId });
    return response.data;
  } catch (error) {
    console.error("Error creating Stripe payment intent", error);
    throw error;
  }
};
