const API_URL = "http://localhost:3000/api/shipping-address";

/**
 * Obtiene las direcciones de envío reales del backend.
 */
export async function getShippingAddresses() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) return [];
      throw new Error("Error al obtener las direcciones");
    }

    const data = await response.json();
    // El backend devuelve { message, count, addresses: [] }
    return data.addresses || data || [];
  } catch (err) {
    console.error("getShippingAddresses error:", err);
    return [];
  }
}

/**
 * Obtiene la dirección de envío predeterminada desde el servidor.
 */
export async function getDefaultShippingAddress() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/default`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const addresses = await getShippingAddresses();
      return addresses.find((a) => a.isDefault) || addresses[0] || null;
    }

    const data = await response.json();
    return data.address || data || null;
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
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Error al crear la dirección");
  }

  const data = await response.json();
  return data.address || data;
}

/**
 * Actualiza una dirección de envío existente.
 */
export async function updateShippingAddress(addressId, addressData) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Error al actualizar la dirección");
  }

  const data = await response.json();
  return data.address || data;
}

/**
 * Elimina una dirección de envío.
 */
export async function deleteShippingAddress(addressId) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la dirección");
  }

  return true;
}
