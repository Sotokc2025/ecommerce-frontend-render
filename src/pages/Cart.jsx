
// Importa hooks, componentes y contexto necesarios para la página del carrito.
import { useNavigate } from "react-router-dom";
import CartView from "../components/organisms/Cart/CartView";
import Button from "../components/atoms/Button";
import Icon from "../components/atoms/Icon/Icon";
import { useCart } from "../context/CartContext";
import "./Cart.css";

// TODO: Agregar animaciones al agregar/eliminar productos del carrito.
// TODO: Permitir editar cantidades directamente en la vista principal del carrito.
// TODO: Mejorar el feedback visual al vaciar el carrito.
// TODO: Agregar pruebas unitarias para el manejo de carrito vacío y acciones del usuario.

// Componente principal Cart
export default function Cart() {
  // Obtiene los items, funciones y totales del contexto de carrito.
  const { cartItems, clearCart, getTotalItems, getTotalPrice } = useCart();

  // Hook para navegación entre páginas.
  const navigate = useNavigate();

  // Si el carrito está vacío, muestra mensaje y botón para explorar productos.
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <Icon name="cart" size={100}></Icon>
        <h2>Tu carrito de madera está vacío</h2>
        <p>Agrega productos de madera para empezar tu proyecto</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          <span>Seguir explorando maderas</span>
        </Button>
      </div>
    );
  }

  // Si hay productos, muestra el carrito, resumen y acciones.
  return (
    <div className="cart">
      <div className="cart-header">
        <div className="cart-header-title">
          <Icon name="cart" size={32} />
          <h1>Carrito de Maderas</h1>
        </div>
        <div className="cart-header-info">
          <span className="cart-items-count">
            {getTotalItems()} {getTotalItems() === 1 ? "artículo" : "artículos"}
          </span>
          {/* Botón para vaciar el carrito */}
          <Button
            variant="ghost"
            className="danger clear-cart-btn"
            onClick={clearCart}
            title="Vaciar carrito"
            size="sm"
          >
            <Icon name="trash" size={18} />
            <span>Vaciar carrito de madera</span>
          </Button>
        </div>
      </div>

      <div className="cart-items">
        {/* Vista de los productos en el carrito */}
        <CartView />
        <div className="cart-summary">
          <div className="cart-total">
            <span className="cart-total-subtitle">Total a pagar</span>
            <h2>${getTotalPrice().toFixed(2)}</h2>
          </div>
          <div className="cart-actions">
            {/* Botón para proceder al checkout */}
            <Button
              variant="primary"
              onClick={() => navigate("/checkout")}
              size="lg"
              disabled={!cartItems || cartItems.length === 0}
              title={
                !cartItems || cartItems.length === 0
                  ? "Agrega productos al carrito para continuar"
                  : "Proceder al pago"
              }
            >
              <Icon name="creditCard" size={20} />
              <span>Comprar maderas</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
