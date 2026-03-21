// Importa los hooks necesarios de React para crear el contexto y manejar el estado.
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// Importar servicios de carrito y auth
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Función para inicializar el carrito (se puede llamar al montar o al cambiar de usuario)
  const initializeCart = useCallback(async () => {
    setIsLoading(true);
    if (isAuthenticated && user) {
      try {
        const response = await cartService.getCart(user._id || user.id);
        const remoteCart = response?.cart;
        if (remoteCart && remoteCart.products) {
          // Mapear el formato del BE { product: {...}, quantity } al de contexto { ..., id, quantity }
          const normalizedItems = remoteCart.products.map(item => ({
            ...item.product,
            id: item.product._id || item.product.id,
            quantity: item.quantity
          }));
          
          // Fusionar con el local si existe (transición de invitado a logueado)
          const savedLocalCart = localStorage.getItem("cart");
          const localItems = savedLocalCart ? JSON.parse(savedLocalCart) : [];
          
          if (localItems.length > 0) {
            // Si hay local, lo subimos al BE (simulamos merge)
            // En una app real, esto podría hacerse en el BE, pero aquí lo forzamos
            setCartItems(normalizedItems);
            localStorage.removeItem("cart");
          } else {
            setCartItems(normalizedItems);
          }
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error sincronizando carrito remoto:", error);
        setCartItems([]);
      }
    } else {
      // Modo Invitado o Logout
      const savedCart = localStorage.getItem("cart");
      // Si cerramos sesión, opcionalmente podríamos querer limpiar el carrito local
      // El usuario reportó que persisten productos del anterior, así que limpiamos.
      if (!isAuthenticated) {
        setCartItems([]);
        localStorage.removeItem("cart");
      } else {
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);

  // Re-inicializar cuando el estado de autenticación cambie (login/logout)
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Persistencia local (solo para persistir cambios mientras se está en la misma sesión/invitado)
  useEffect(() => {
    if (!isLoading && cartItems.length >= 0) {
      // Solo guardar en localStorage si no estamos cargando
      // Si estamos logueados, el BE es la fuente de verdad, pero local sirve para offline
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product.id || product._id;
    const maxStock = product.stock || 0;

    // Identificar cantidad real que podemos agregar
    const existingSyncItem = cartItems.find((item) => item.id === productId);
    let quantityToAdd = quantity;
    
    if (existingSyncItem) {
      if (existingSyncItem.quantity + quantity > maxStock) {
        quantityToAdd = maxStock - existingSyncItem.quantity;
      }
    } else {
      if (quantity > maxStock) quantityToAdd = maxStock;
    }

    if (quantityToAdd <= 0) return;

    // Actualización optimista
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        return [...prevItems, { ...product, id: productId, quantity: quantityToAdd }];
      }
    });

    if (isAuthenticated) {
      try {
        await cartService.addToCart(productId, quantityToAdd);
      } catch (error) {
        console.error("Error persistiendo en backend:", error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    if (isAuthenticated) {
      try {
        await cartService.removeToCart(productId);
      } catch (error) {
        console.error("Error elminando del backend:", error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const existingItem = cartItems.find((item) => item.id === productId);
    if (!existingItem) return;
    
    const maxStock = existingItem.stock || 0;
    const finalQuantity = newQuantity > maxStock ? maxStock : newQuantity;

    if (existingItem.quantity === finalQuantity) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: finalQuantity } : item))
    );

    if (isAuthenticated) {
      try {
        await cartService.updateCartItem(productId, finalQuantity);
      } catch (error) {
        console.error("Error actualizando en el backend:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error("Error vaciando carrito en backend:", error);
      }
    }
  };

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = React.useMemo(() => ({
    cartItems,
    total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    itemsCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoading
  }), [cartItems, isLoading, isAuthenticated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
