
// TODO: Validar los datos importados antes de usarlos (estructura, campos obligatorios).
// TODO: Manejar errores en las promesas y operaciones de pago.
// TODO: Permitir métodos de pago adicionales y simulaciones.
// TODO: Documentar cada función para facilitar el mantenimiento.
// TODO: Agregar pruebas unitarias para los métodos de pago y validaciones.

const API_URL = "http://localhost:3000/api/payment-methods";

/**
 * Obtiene los métodos de pago reales del backend.
 */
export async function getPaymentMethods() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Si no está autenticado o hay error en servidor, no romper la UI: retornar lista vacía
      if (response.status === 401) return [];
      throw new Error("Error al obtener los métodos de pago");
    }

    return response.json();
  } catch (err) {
    console.error("getPaymentMethods error:", err);
    return [];
  }
}

/**
 * Obtiene el método de pago predeterminado desde el servidor.
 */
export async function getDefaultPaymentMethod() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/default`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const methods = await getPaymentMethods();
      return methods.find((m) => m.isDefault) || methods[0] || null;
    }

    return response.json();
  } catch (err) {
    console.error("getDefaultPaymentMethod error:", err);
    const methods = await getPaymentMethods();
    return methods.find((m) => m.isDefault) || methods[0] || null;
  }
}
/**
 * Crea un nuevo método de pago en el backend.
 */
export async function createPaymentMethod(paymentData) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    throw new Error("Error al crear el método de pago");
  }

  return response.json();
}

/**
 * Actualiza un método de pago existente.
 */
export async function updatePaymentMethod(paymentId, paymentData) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${paymentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el método de pago");
  }

  return response.json();
}

/**
 * Elimina un método de pago.
 */
export async function deletePaymentMethod(paymentId) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${paymentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el método de pago");
  }

  return true;
}
