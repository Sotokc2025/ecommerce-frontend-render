// Importa hooks, componentes y utilidades para la página de pedidos.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import Icon from "../components/atoms/Icon/Icon";
import Loading from "../components/atoms/Loading/Loading";
import { getCurrentUser } from "../utils/auth";
import { getUserOrders } from "../services/orderService";
import "./Orders.css";

// Utilidad para formatear moneda (MXN)
const formatMoney = (value = 0) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

// Utilidad para formatear fechas en español.
const formatDate = (isoString) => {
  if (!isoString) return "Fecha desconocida";
  try {
    return new Date(isoString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Fecha inválida";
  }
};

// Componente principal Orders
export default function Orders() {
  // Estado para la lista de pedidos, pedido seleccionado y loading.
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga los pedidos desde el backend.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user || (!user._id && !user.id)) {
          setLoading(false);
          return;
        }

        const data = await getUserOrders(user._id || user.id);
        // El backend devuelve las órdenes, mapeamos para compatibilidad si es necesario
        // aunque ahora usaremos los nombres del BE directamente.
        setOrders(data);
        if (data.length > 0) {
          setSelectedOrderId(data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Memoiza el pedido seleccionado para mostrar detalles.
  const selectedOrder = useMemo(
    () => orders.find((order) => (order._id || order.id) === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // Determina el estado y etiqueta del pedido seleccionado.
  const detailStatusToken = selectedOrder
    ? (selectedOrder.status || "confirmed").toLowerCase()
    : "confirmed";
  const detailStatusLabel = selectedOrder?.status || "Confirmado";

  // Muestra loading si está cargando.
  if (loading) {
    return (
      <div className="orders-page">
        <Loading message="Cargando pedidos guardados..." />
      </div>
    );
  }

  // Si no hay pedidos, muestra mensaje y botón para descubrir productos.
  if (!orders.length) {
    return (
      <div className="orders-page orders-empty">
        <Icon name="package" size={48} />
        <h1>Aún no tienes pedidos</h1>
        <p>
          Tus compras se sincronizarán aquí automáticamente para que puedas
          consultarlas en cualquier momento.
        </p>
        <Link to="/" className="orders-link">
          <Button>Descubrir productos</Button>
        </Link>
      </div>
    );
  }

  // Renderiza la lista de pedidos y el detalle del pedido seleccionado.
  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <p className="eyebrow">Historial de compras</p>
          <h1>Mis pedidos</h1>
        </div>
        <div className="header-actions-group">
          <Button
            variant="ghost"
            className="danger"
            onClick={() => {
              if (window.confirm("¿Estás seguro de que quieres limpiar la vista de pedidos? Las órdenes en la base de datos se mantendrán, pero se reiniciará la vista local.")) {
                setOrders([]);
                setSelectedOrderId(null);
              }
            }}
            title="Limpiar vista de pedidos"
          >
            <Icon name="trash" size={18} />
            <span>Limpiar historial</span>
          </Button>
        </div>
        <div>
          <p className="muted">
            {orders.length === 1
              ? "Tienes 1 pedido realizado"
              : `Tienes ${orders.length} pedidos realizados`}
          </p>
          <Button
            variant="secondary"
            onClick={() => setSelectedOrderId(orders[0]?._id || orders[0]?.id || null)}
          >
            Ver más reciente
          </Button>
        </div>
      </div>

      <div className="orders-content">
        {/* Lista de pedidos */}
        <div className="orders-list card">
          <div className="orders-list-header">
            <h2>Pedidos</h2>
            <span>{orders.length}</span>
          </div>
          <div className="orders-list-body">
            {orders.map((order) => {
              const currentId = order._id || order.id;
              const itemCount = (order.products || order.items || []).length;
              const statusToken = (order.status || "pending").toLowerCase();
              const isActive = selectedOrderId === currentId;
              return (
                <button
                  key={currentId}
                  className={`order-card${isActive ? " active" : ""}`}
                  onClick={() => setSelectedOrderId(currentId)}
                >
                  <div className="order-card-head">
                    <span className="order-id">#{currentId}</span>
                    <span
                      className={`order-status order-status-${statusToken}`}
                    >
                      {order.status || "Pendiente"}
                    </span>
                  </div>
                  <p className="order-date">{formatDate(order.createdAt || order.date)}</p>
                  <div className="order-card-meta">
                    <span>{itemCount} artículos</span>
                    <strong>{formatMoney(order.totalPrice || order.total || 0)}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle del pedido seleccionado */}
        <div className="orders-detail card">
          {selectedOrder ? (
            <>
              <div className="order-detail-header">
                <div>
                  <p className="eyebrow">Pedido #{selectedOrder._id || selectedOrder.id}</p>
                  <h2>{formatMoney(selectedOrder.totalPrice || selectedOrder.total || 0)}</h2>
                  <p className="muted">{formatDate(selectedOrder.createdAt || selectedOrder.date)}</p>
                </div>
                <span
                  className={`order-status order-status-${detailStatusToken}`}
                >
                  {detailStatusLabel}
                </span>
              </div>

              <div className="order-section">
                <h3>Resumen del pago</h3>
                <ul className="order-summary-list">
                  <li>
                    <span>Monto Productos</span>
                    <strong>{formatMoney((selectedOrder.totalPrice || 0) - (selectedOrder.shippingCost || 0))}</strong>
                  </li>
                  <li>
                    <span>Envío</span>
                    <strong>
                      {selectedOrder.shippingCost === 0 || selectedOrder.shipping === 0
                        ? "Gratis"
                        : formatMoney(selectedOrder.shippingCost || selectedOrder.shipping || 0)}
                    </strong>
                  </li>
                  <li className="order-summary-total">
                    <span>Total</span>
                    <strong>{formatMoney(selectedOrder.totalPrice || selectedOrder.total || 0)}</strong>
                  </li>
                </ul>
              </div>

              <div className="order-section">
                <h3>Dirección de envío</h3>
                {selectedOrder.shippingAddress ? (
                  <address className="order-address">
                    <strong>{selectedOrder.shippingAddress.name}</strong>
                    <p>{selectedOrder.shippingAddress.address1}</p>
                    {selectedOrder.shippingAddress.address2 && (
                      <p>{selectedOrder.shippingAddress.address2}</p>
                    )}
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </address>
                ) : (
                  <p className="muted">Sin dirección registrada.</p>
                )}
              </div>

              <div className="order-section">
                <h3>Método de pago</h3>
                {selectedOrder.paymentMethod ? (
                  <div>
                    <p>{selectedOrder.paymentMethod.alias}</p>
                    <p>
                      ****{" "}
                      {selectedOrder.paymentMethod.cardNumber?.slice(-4) || "----"}
                    </p>
                  </div>
                ) : (
                  <p className="muted">Sin método de pago registrado.</p>
                )}
              </div>

              <div className="order-section">
                <h3>Productos</h3>
                <ul className="order-items">
                  {(selectedOrder.products || selectedOrder.items || []).map((item, index) => (
                    <li key={`${selectedOrder._id || selectedOrder.id}-${item._id || item.id || index}`}>
                      <div>
                        <p>{item.productId?.name || item.name || item.title || "Producto"}</p>
                        <span>
                          Cantidad: {item.quantity || 1} · Precio:{" "}
                          {formatMoney(item.price || 0)}
                        </span>
                      </div>
                      <strong>
                        {formatMoney(
                          (item.price || 0) * (item.quantity || 1)
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="orders-empty">
              <h3>Selecciona un pedido de la lista</h3>
              <p className="muted">
                Aquí verás el detalle completo: productos, dirección y método de
                pago utilizados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
