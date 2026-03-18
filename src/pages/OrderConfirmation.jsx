
// Importa hooks, componentes y estilos necesarios para la confirmación de pedido.
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/atoms/Icon/Icon";
import "./OrderConfirmation.css";

// Componente principal OrderConfirmation
export default function OrderConfirmation() {
  // Obtiene la información de la orden desde la navegación.
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  // Redirige al inicio si no hay orden.
  useEffect(() => {
    if (!order) {
      navigate("/");
      return;
    }
  }, [order, navigate]);

  // Extrae datos de la orden para mostrar. Corregido para mapeo del backend.
  const address = order.shippingAddress || {};
  const shipping = order.shippingCost || 0;
  const total = order.totalPrice || 0;

  // Derivamos subtotal e IVA del total si no vienen (el BE no los guarda por separado)
  const TAX_RATE = 0.16;
  const subtotal = (total - shipping) / (1 + TAX_RATE);
  const tax = total - shipping - subtotal;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "No disponible";

  // Utilidad para formatear moneda (MXN)
  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  // Renderiza la confirmación de pedido con detalles y acciones.
  return (
    <div className="order-confirmation">
      <div className="confirmation-content">
        <div className="confirmation-icon">
          <Icon name="checkCircle" size={64} className="success"></Icon>
        </div>
        <h1>¡Gracias por tu compra!</h1>
        <p className="confirmation-message">
          Tu pedido <strong>#{order._id || order.id || "N/A"}</strong> ha sido confirmado y
          está siendo procesado
        </p>
        <div className="confirmation-details">
          <h2>Detalles de tu pedido</h2>
          <div className="order-info">
            <p>
              <strong>Fecha: </strong>
              {orderDate}
            </p>
            <h3>Productos</h3>
            <ul className="order-items">
              {(order.products || order.items || []).map((item, idx) => (
                <li key={item._id || item.id || idx}>
                  {item.productId?.name || item.name} x {item.quantity} - {formatMoney(item.price)}
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="order-totals">
              <p>
                <strong>Subtotal: </strong>
                {formatMoney(subtotal)}
              </p>
              <p>
                <strong>IVA: </strong>
                {formatMoney(tax)}
              </p>
              <p>
                <strong>Envío: </strong>
                {shipping === 0 ? "Gratis" : formatMoney(shipping)}
              </p>
              <p>
                <strong>Total:</strong> {formatMoney(total)}
              </p>

              <p>
                <strong>Dirección de envío:</strong>
              </p>
              <address>
                {address.name || "No disponible"}
                <br />
                {address.address1 || ""}
                {address.address1 && <br />}
                {address.address2 || ""}
                {address.address2 && <br />}
                {address.city && address.postalCode
                  ? `${address.city}, ${address.postalCode}`
                  : "Ciudad y código postal no disponibles"}
                <br />
                {address.country || "País no especificado"}
              </address>
            </div>
          </div>
          <p>
            Hemos enviado un correo electrónico con los detalles de tu compra.
            También puedes ver el estado de tu pedido en cualquier momento desde
            tu perfil.
          </p>
        </div>
        <div className="confirmation-actions">
          <Link to="/" className="button primary">
            <Icon name="home" size={20} />
            <span>Volver al inicio</span>
          </Link>
          <Link to="/orders" className="button secondary">
            <Icon name="package" size={20} />
            <span>Ver mis pedidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
