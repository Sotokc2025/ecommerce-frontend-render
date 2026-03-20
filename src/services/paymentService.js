
// TODO: Validar los datos importados antes de usarlos (estructura, campos obligatorios).
// TODO: Manejar errores en las promesas y operaciones de pago.
// TODO: Permitir métodos de pago adicionales y simulaciones.
// TODO: Documentar cada función para facilitar el mantenimiento.
// TODO: Agregar pruebas unitarias para los métodos de pago y validaciones.

import { http } from "./http";

const API_URL = "/payment-methods";

/**
 * Obtiene los métodos de pago reales del backend.
 */
export async function getPaymentMethods() {
  try {
    const response = await http.get(`${API_URL}/me`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) return [];
    console.error("getPaymentMethods error:", err);
    return [];
  }
}
/**
 * Obtiene el método de pago predeterminado desde el servidor.
 */
export async function getDefaultPaymentMethod() {
  try {
    const response = await http.get(`${API_URL}/default`);
    return response.data;
  } catch (err) {
    console.error("getDefaultPaymentMethod error:", err);
    const methods = await getPaymentMethods();
    return methods.find((m) => m.isDefault) || methods[0] || null;
  }
}/**
 * Crea un nuevo método de pago en el backend.
 */
export async function createPaymentMethod(paymentData) {
  try {
    const response = await http.post(API_URL, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el método de pago");
  }
}

/**
 * Actualiza un método de pago existente.
 */
export async function updatePaymentMethod(paymentId, paymentData) {
  try {
    const response = await http.put(`${API_URL}/${paymentId}`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el método de pago");
  }
}

/**
 * Elimina un método de pago.
 */
export async function deletePaymentMethod(paymentId) {
  try {
    await http.delete(`${API_URL}/${paymentId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el método de pago");
  }
}
