const API_URL = "http://localhost:3000/api/orders"; // Ajustar si el puerto es distinto o usar variable de entorno

/**
 * Crea una nueva orden en el backend.
 * @param {Object} orderData - Datos de la orden (user, products, shippingAddress, paymentMethod, shippingCost).
 * @returns {Promise<Object>} - La orden creada.
 */
export async function createOrder(orderData) {
    const token = localStorage.getItem("authToken"); // Sincronizado con auth.js

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la orden");
    }

    return response.json();
}

/**
 * Obtiene las órdenes del usuario actual.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array>} - Lista de órdenes.
 */
export async function getUserOrders(userId) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Error al obtener las órdenes");
    }

    return response.json();
}
