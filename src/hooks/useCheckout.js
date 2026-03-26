// @ts-check
import { useState, useCallback, useMemo } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import * as orderService from '../services/orderService';

/**
 * @typedef {Object} CheckoutFormData
 * @property {string} shippingAddressId - ID de la dirección de envío
 * @property {string} [paymentMethodId] - ID del método de pago (opcional si es Stripe)
 * @property {number} [shippingCost] - Costo calculado de envío
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId - ID del producto
 * @property {number} quantity - Cantidad a comprar
 * @property {number} price - Precio unitario del producto
 */

/**
 * @typedef {Object} OrderPayload
 * @property {string} user - ID del usuario
 * @property {OrderItem[]} products - Lista de productos mapeados
 * @property {string} shippingAddress - ID de la dirección
 * @property {string | null} paymentMethod - ID del método (null para Stripe inicial)
 * @property {number} shippingCost - Costo final de envío
 */

/**
 * Hook Soberano de Checkout (Fase 6 - Senior).
 * Gestiona el flujo transaccional con idempotencia y validación atómica.
 *
*/
export function useCheckout() {
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));
  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [orderResult, setOrderResult] = useState(null);

  // Generamos una llave de idempotencia única para esta "sesión" de checkout.
  const idempotencyKey = useMemo(() => `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []);

  /**
   * Procesa la creación de la orden en el backend.
   * @param {CheckoutFormData} formData - Datos de envío y pago
   * @returns {Promise<any>}
   */
  /**
   * Procesa la creación de la orden en el backend.
   * @param {CheckoutFormData} formData - Datos de envío y pago
   * @returns {Promise<any>}
   */
  const processCheckout = useCallback(
    /** @param {CheckoutFormData} formData */
    async (formData) => {
    if (!user) {
      setError("Debes iniciar sesión para finalizar la compra.");
      return null;
    }

    if (cartItems.length === 0) {
      setError("El carrito está vacío.");
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Preparamos el payload conforme al Order Controller Senior
      /** @type {OrderPayload} */
      const orderPayload = {
        user: String(user?._id || user?.id || ""),
        products: cartItems.map(item => ({
          productId: String(item.id || item._id),
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.shippingAddressId,
        paymentMethod: formData.paymentMethodId || null,
        shippingCost: formData.shippingCost || 0
      };

      // Llamada al servicio con la llave de idempotencia en los headers
      const response = await orderService.createOrder(orderPayload, { 
        headers: { 'idempotency-key': idempotencyKey }
      });

      if (response) {
        setOrderResult(response);
        return response;
      }
    } catch (err) {
      console.error("Error en Checkout Senior Hook:", err);
      // @ts-ignore
      const msg = err.response?.data?.message || err.message || "Error al procesar la orden.";
      setError(msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user, cartItems, idempotencyKey]);

  return {
    currentStep,
    setCurrentStep,
    isProcessing,
    error,
    orderResult,
    processCheckout,
    totalAmount: totalPrice(),
    clearCart
  };
}