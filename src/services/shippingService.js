import { http } from "./http";

const API_URL = "/shipping-address";

/**
 * Obtiene las direcciones de envío reales del backend.
 */
export async function getShippingAddresses() {
  try {
    const response = await http.get(API_URL);
    return response.data.addresses || response.data || [];
  } catch (err) {
    if (err.response?.status === 401) return [];
    console.error("getShippingAddresses error:", err);
    return [];
  }
}

/**
 * Obtiene la dirección de envío predeterminada desde el servidor.
 */
export async function getDefaultShippingAddress() {
  try {
    const response = await http.get(`${API_URL}/default`);
    return response.data.address || response.data || null;
  } catch (err) {
    console.error("getDefaultShippingAddress error:", err);
    const addresses = await getShippingAddresses();
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }
}
/**
 * Crea una nueva dirección de envío en el backend.
 */
export async function createShippingAddress(addressData) {
  try {
    const response = await http.post(API_URL, addressData);
    return response.data.address || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear la dirección");
  }
}

/**
 * Actualiza una dirección de envío existente.
 */
export async function updateShippingAddress(addressId, addressData) {
  try {
    const response = await http.put(`${API_URL}/${addressId}`, addressData);
    return response.data.address || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar la dirección");
  }
}

/**
 * Elimina una dirección de envío.
 */
export async function deleteShippingAddress(addressId) {
  try {
    await http.delete(`${API_URL}/${addressId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar la dirección");
  }
}
