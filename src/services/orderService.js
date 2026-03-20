import { http } from "./http";

const API_URL = "/orders";

/**
 * Crea una nueva orden en el backend.
 * @param {Object} orderData - Datos de la orden (user, products, shippingAddress, paymentMethod, shippingCost).
 * @returns {Promise<Object>} - La orden creada.
 */
export async function createOrder(orderData) {
    try {
        const response = await http.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al crear la orden");
    }
}

/**
 * Obtiene las órdenes del usuario actual.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array>} - Lista de órdenes.
 */
export async function getUserOrders(userId) {
    try {
        const response = await http.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener las órdenes");
    }
}
