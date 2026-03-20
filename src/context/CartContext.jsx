// Importa los hooks necesarios de React para crear el contexto y manejar el estado.
import React, { createContext, useContext, useEffect, useState } from "react";
// TODO: Usar useMemo para optimizar cálculos de totales si el carrito crece.
// TODO: Agregar manejo de errores para operaciones con localStorage (try/catch).
// TODO: Permitir agregar descuentos o cupones en el contexto del carrito.
// TODO: Documentar las funciones del contexto para facilitar mantenimiento.
// TODO: Agregar pruebas unitarias para las funciones del contexto.

// Crea el contexto del carrito.
// (import ya declarado arriba)
// Importar servicios de carrito
import * as cartService from "../services/cartService";
import { isAuthenticated, getCurrentUser } from "../services/auth";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga inicial: LocalStorage para invitados o Backend para logueados
  useEffect(() => {
    const initializeCart = async () => {
      const user = getCurrentUser();
      const isAuth = isAuthenticated();

      if (isAuth && user) {
        try {
          const remoteCart = await cartService.fetchCart(user._id || user.id);
          if (remoteCart && remoteCart.products) {
            // Mapear el formato del BE { product: {...}, quantity } al de contexto { ..., quantity }
            const normalizedItems = remoteCart.products.map(item => ({
              ...item.product,
              id: item.product._id || item.product.id,
              quantity: item.quantity
            }));
            
            // Si hay items locales (de antes de loguearse), fusionarlos (Simplicidad por ahora: Priorizar local y subir)
            const savedLocalCart = localStorage.getItem("cart");
            const localItems = savedLocalCart ? JSON.parse(savedLocalCart) : [];
            
            if (localItems.length > 0) {
              // TODO: Estrategia de Merge más compleja si fuera necesaria
              // Por ahora, si hay local, lo subimos al BE uno por uno
              for (const item of localItems) {
                await cartService.addProductToRemoteCart(item.id, item.quantity);
              }
              // Volvemos a leer para tener todo sincronizado
              const updatedRemote = await cartService.fetchCart(user._id || user.id);
              const finalItems = updatedRemote.products.map(item => ({
                ...item.product,
                id: item.product._id || item.product.id,
                quantity: item.quantity
              }));
              setCartItems(finalItems);
              localStorage.removeItem("cart"); // Limpiar local tras éxito
            } else {
              setCartItems(normalizedItems);
            }
          }
        } catch (error) {
          console.error("Error sincronizando carrito remoto:", error);
          // Fallback a local si el BE falla
          const savedCart = localStorage.getItem("cart");
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
      } else {
        // Modo Invitado
        const savedCart = localStorage.getItem("cart");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
      setIsLoading(false);
    };

    initializeCart();
  }, []);

  // Persistencia local para offline/invitados
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addToCart = async (product, quantity = 1) => {
    const isAuth = isAuthenticated();
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

    if (quantityToAdd <= 0) {
       // Ya se alcanzó el límite de inventario
       return;
    }

    // Actualización optimista del estado local
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

    // Persistencia remota si aplica
    if (isAuth) {
      try {
        await cartService.addProductToRemoteCart(productId, quantityToAdd);
      } catch (error) {
        console.error("Error persistiendo en backend:", error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    if (isAuthenticated()) {
      try {
        await cartService.removeRemoteCartItem(productId);
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

    // Limitar cantidad al stock disponible
    const existingItem = cartItems.find((item) => item.id === productId);
    if (!existingItem) return;
    
    const maxStock = existingItem.stock || 0;
    const finalQuantity = newQuantity > maxStock ? maxStock : newQuantity;

    if (existingItem.quantity === finalQuantity) return; // Sin cambios reales

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: finalQuantity } : item))
    );

    if (isAuthenticated()) {
      try {
        await cartService.updateRemoteCartItem(productId, finalQuantity);
      } catch (error) {
        console.error("Error actualizando en el backend:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (isAuthenticated()) {
      try {
        await cartService.clearRemoteCart();
      } catch (error) {
        console.error("Error vaciando carrito en backend:", error);
      }
    }
  };

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Memoizar el valor del contexto para evitar re-renders innecesarios en toda la app.
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
  }), [cartItems, isLoading]); // Solo cambia si cambian los items o el estado de carga.

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook para consumir el contexto del carrito.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
