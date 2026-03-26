// @ts-check
import { create } from 'zustand';
import * as cartService from '../services/cartService';
import { useAuthStore } from './useAuthStore';
/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} [_id]
 * @property {string} [name]
 * @property {number} price
 * @property {number} quantity
 * @property {number} [stock]
 */
/**
 * @typedef {Object} CartState
 * @property {CartItem[]} cartItems
 * @property {boolean} isLoading
 * @property {() => number} totalItems
 * @property {() => number} totalPrice
 * @property {() => Promise<void>} initializeCart
 * @property {(product: any, quantity?: number) => Promise<void>} addToCart
 * @property {(productId: string) => Promise<void>} removeFromCart
 * @property {(productId: string, newQuantity: number) => Promise<void>} updateQuantity
 * @property {() => Promise<void>} clearCart
 * @property {() => Promise<void>} _syncRemote
 */
/**
 * Store de Zustand para la gestión global del carrito.
 * Centraliza la concurrencia y sincronización con el backend MM.
 * 🛡️🛒✨
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<CartState>>}
 */
// @ts-ignore
export const useCartStore = create((set, get) => ({
  cartItems: [],
  isLoading: false,

  // --- GETTERS ---
  totalItems: () => get().cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
  totalPrice: () => get().cartItems.reduce((total, item) => total + (item.price * (item.quantity || 0)), 0),

  // --- ACTIONS ---
  
  initializeCart: async () => {
    set({ isLoading: true });
    // Usamos el estado de auth para saber si sincronizamos
    const { user, isAuthenticated } = useAuthStore.getState();
    const userId = user?._id || user?.id;

    if (isAuthenticated && userId) {
      try {
        const response = await cartService.getCart(userId);
        const remoteCart = response?.cart;
        if (remoteCart && remoteCart.products) {
          const normalizedItems = remoteCart.products.map((/** @type {any} */ item) => ({
            ...item.product,
            id: item.product._id || item.product.id,
            totalPrice: item.product.price * item.quantity,
            quantity: item.quantity
          }));
          set({ cartItems: normalizedItems });
          localStorage.removeItem("cart"); 
        } else {
          set({ cartItems: [] });
        }
      } catch (error) {
        console.error("Cart sync failed:", error);
        set({ cartItems: [] });
      }
    } else {
      const savedCart = localStorage.getItem("cart");
      set({ cartItems: savedCart ? JSON.parse(savedCart) : [] });
    }
    set({ isLoading: false });
  },

  addToCart: async (product, quantity = 1) => {
    /** @type {CartState} */
    const state = get();
    const { cartItems } = state;
    const productId = product.id || product._id;
    const maxStock = product.stock || 0;

    const existingItem = cartItems.find((item) => item.id === productId);
    let quantityToAdd = quantity;

    if (existingItem) {
      if (existingItem.quantity + quantity > maxStock) {
        quantityToAdd = maxStock - existingItem.quantity;
      }
    } else {
      if (quantity > maxStock) quantityToAdd = maxStock;
    }

    if (quantityToAdd <= 0) return;

    const newItems = existingItem
      ? cartItems.map((item) => item.id === productId ? { ...item, quantity: item.quantity + quantityToAdd } : item)
      : [...cartItems, { ...product, id: productId, quantity: quantityToAdd }];

    set({ cartItems: newItems });
    localStorage.setItem("cart", JSON.stringify(newItems));

    if (useAuthStore.getState().isAuthenticated) {
      try {
        await cartService.addToCart(productId, quantityToAdd);
      } catch (err) {
        console.error("Async add cart failed:", err);
      }
    }
  },

  removeFromCart: async (productId) => {
    /** @type {CartState} */
    const { cartItems } = get();
    const newItems = cartItems.filter((item) => item.id !== productId);
    set({ cartItems: newItems });
    localStorage.setItem("cart", JSON.stringify(newItems));

    if (useAuthStore.getState().isAuthenticated) {
      try {
        await cartService.removeToCart(productId);
      }
      catch (err) {
        console.error("Async remove cart failed:", err);
      }
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    /** @type {CartState} */
    const state = get();
    const { cartItems } = state;
    
    if (newQuantity <= 0) {
      state.removeFromCart(productId);
      return;
    }

    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    const finalQuantity = newQuantity > (item.stock || 0) ? (item.stock || 0) : newQuantity;
    if (item.quantity === finalQuantity) return;

    const newItems = cartItems.map((i) => i.id === productId ? { ...i, quantity: finalQuantity } : i);
    set({ cartItems: newItems });
    localStorage.setItem("cart", JSON.stringify(newItems));

    if (useAuthStore.getState().isAuthenticated) {
      try {
        await cartService.updateCartItem(productId, finalQuantity);
      }
      catch (err) {
        console.error("Async update cart failed:", err);
      }
    }
  },

  clearCart: async () => {
    set({ cartItems: [] });
    localStorage.removeItem("cart");
    if (useAuthStore.getState().isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error("Async clear cart failed:", err);
      }
    }
  },
  /**
   * Acción de sincronización atómica e IDEMPOTENTE con el backend.
   * Envía el estado actual completo de Zustand para sobrescribir el remoto en Mongo.
   * Previene inconsistencias ante reintentos de red o problemas de concurrencia.
  */
  _syncRemote: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    const { cartItems } = get();
    try {
      await cartService.syncCart(cartItems.map(item => ({
        productId: String(item.id || item._id || ""),
        quantity: item.quantity
      })));
    }
    catch (error) {
      console.error("Atomic sync failed:", error);
    }
  }
}));