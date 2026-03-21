import { http } from "./http";

/**
 * Obtiene todas las direcciones de envío.
 */
export const fetchShippingAddresses = async () => {
  try {
    const response = await http.get("/shipping-address");
    // El backend devuelve { message, count, addresses }
    return response.data.addresses || response.data || [];
  } catch (error) {
    console.error("Error fetching shipping addresses", error);
    return [];
  }
};

/**
 * Alias para fetchShippingAddresses para compatibilidad.
 */
export const getShippingAddresses = fetchShippingAddresses;

/**
 * Obtiene la dirección de envío por defecto.
 */
export const getDefaultShippingAddress = async () => {
  try {
    const response = await http.get("/shipping-address/default");
    // El backend devuelve { message, address }
    // Importante: devolver null si address es null para evitar objetos "truthy" vacíos en el frontend
    return response.data?.address || null;
  } catch (error) {
    console.error("Error fetching default shipping address", error);
    return null;
  }
};

/**
 * Crea una dirección de envío.
 */
export const createShippingAddress = async (addressData) => {
  try {
    const response = await http.post("/shipping-address", addressData);
    // El backend devuelve { message, address }
    return response.data?.address || response.data;
  } catch (error) {
    console.error("Error creating shipping address", error);
    return null;
  }
};

/**
 * Actualiza una dirección de envío.
 */
export const updateShippingAddress = async (id, addressData) => {
  try {
    const response = await http.put(`/shipping-address/${id}`, addressData);
    // El backend devuelve { message, address }
    return response.data?.address || response.data;
  } catch (error) {
    console.error("Error updating shipping address", error);
    return null;
  }
};

/**
 * Elimina una dirección de envío.
 */
export const deleteShippingAddress = async (id) => {
  try {
    const response = await http.delete(`/shipping-address/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shipping address", error);
    return null;
  }
};
