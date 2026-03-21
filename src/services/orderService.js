import { http } from "./http";
import { getCurrentUser } from "./auth";

/**
 * Obtiene los pedidos de un usuario específico.
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
 * Crea una nueva orden.
 */
export const createOrder = async (orderData) => {
  try {
    const response = await http.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating a order", error);
    throw error;
  }
};

/**
 * Obtiene una orden por su ID.
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
