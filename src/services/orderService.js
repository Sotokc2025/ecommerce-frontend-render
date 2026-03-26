// @ts-check
import { http } from "./http";
import { getCurrentUser } from "./auth";

/**
 * Obtiene los pedidos de un usuario específico.
 * @returns {Promise<any[]>}
 */
export const getUserOrders = async () => {
  try {
    const user = getCurrentUser();
    if (!user?._id) {
      console.warn("No user found to fetch orders");
      return [];
    }
    const response = await http.get(`/orders/user/${user._id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders", error);
    throw error;
  }
};

/**
 * Crea una nueva orden con soporte para idempotencia.
 * @param {Object} orderData 
 * @param {import('axios').AxiosRequestConfig} [config] - Configuración opcional para headers
 */
export const createOrder = async (orderData, config = {}) => {
  try {
    const response = await http.post("/orders", orderData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating a order", error);
    throw error;
  }
};

/**
 * Obtiene una orden por su ID.
 * @param {string} id - UUID de la orden
 * @returns {Promise<any>}
 */
export const getOrderById = async (id) => {
  try {
    const response = await http.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching a order", error);
    throw error;
  }
};
