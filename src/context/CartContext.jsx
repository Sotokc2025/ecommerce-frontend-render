// @ts-check
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
/**
 * @typedef {import('../store/useCartStore').CartState} CartState
 */
/**
 * CartContext (Proxy para Zustand - Fase 3).
 * Redirige todas las llamadas de contexto al motor de Zustand.
 * Previene re-renders innecesarios en todo el árbol de componentes.
 * 🛡️🛒✨
 * @type {import('react').Context<any>}
 */
const CartContext = createContext(/** @type {any} */ (null));

/** @param {{ children: import('react').ReactNode }} props */

export function CartProvider({ children }) {
  const store = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  // Re-inicializar el carrito cuando cambie el estado de autenticación (login/logout)
  useEffect(() => {
    store.initializeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, user?._id]);
  // Memorización de valores para compatibilidad
  const value = useMemo(() => ({
    ...store,
    // Mapeamos getters a nombres directos esperados en componentes
    itemsCount: store.totalItems(),
    total: store.totalPrice(),
    // Para componentes que usan funciones
    getTotalItems: store.totalItems,
    getTotalPrice: store.totalPrice,
  }), [store]);

  return <CartContext.Provider value={/** @type {any} */ (value)}>{children}</CartContext.Provider>;
}
/**
 * Hook useCart: Consume directamente el store o el proxy de contexto.
 * @returns {any}
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Si no hay contexto, fallamos silenciosamente al store directo (Fase de transición)
    // @ts-ignore
    return useCartStore();
  }
  return context;
}