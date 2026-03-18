// Importa el hook useCart para acceder al estado y funciones del carrito.
import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
// Importa el componente Button reutilizable.
import Button from "../../atoms/Button";
// Importa el componente Icon para mostrar íconos.
import Icon from "../../atoms/Icon/Icon";
import "./CartView.css";

// Componente funcional que muestra la lista de productos en el carrito.
export default function CartView() {
  // Obtiene los productos del carrito y las funciones para modificarlo.
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [notification, setNotification] = useState(null);

  return (
    <div className="cart-view">
      {/* Encabezado con el número de artículos en el carrito */}
      <div className="cart-view-header">
        <h2>
          {cartItems.length} {cartItems.length === 1 ? "artículo" : "artículos"}
        </h2>
      </div>

      {/* Renderiza cada producto del carrito */}
      {cartItems &&
        cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            {/* Imagen del producto */}
            <div className="cart-item-image">
              <img src={item.imagesUrl && item.imagesUrl[0] ? item.imagesUrl[0] : "/img/products/placeholder.svg"} alt={item.name} loading="lazy" />
            </div>

            {/* Información del producto */}
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">{`$${item.price.toFixed(2)}`}</p>
            </div>

            {/* Controles para modificar la cantidad */}
            <div className="cart-item-quantity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Icon name="minus" size={15}></Icon>
              </Button>
              <span>{item.quantity}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Icon name="plus" size={15}></Icon>
              </Button>
            </div>

            {/* Total por producto */}
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Botón para eliminar el producto del carrito */}
            <Button
              variant="ghost"
              className="danger"
              size="sm"
              onClick={() => {
                removeFromCart(item.id);
                setNotification("Producto eliminado del carrito");
                setTimeout(() => {
                  setNotification(null);
                }, 2000);
              }}
              title="Eliminar artículo"
            >
              <Icon name="trash" size={16} />
            </Button>
          </div>
        ))}
      {notification && (
        <div className="cart-notification">
          {notification}
        </div>
      )}
    </div>
  );
}