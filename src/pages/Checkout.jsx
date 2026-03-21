import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/organisms/Cart/CartView";
import AddressForm from "../components/organisms/Checkout/Address/AddressForm";
import AddressList from "../components/organisms/Checkout/Address/AddressList";
import PaymentForm from "../components/organisms/Checkout/Payment/PaymentForm";
import PaymentList from "../components/organisms/Checkout/Payment/PaymentList";
import SummarySection from "../components/organisms/Checkout/shared/SummarySection";
import Button from "../components/atoms/Button";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import Loading from "../components/atoms/Loading/Loading";
import { useCart } from "../context/CartContext";
import {
  getDefaultPaymentMethod,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentService";
import {
  getDefaultShippingAddress,
  getShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../services/shippingService";
import { createOrder as apiCreateOrder } from "../services/orderService";
import { getCurrentUser } from "../services/auth";
import "./Checkout.css";

export default function Checkout() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();

  // --- LÓGICA DE NEGOCIO FINANCIERA ---
  // Cálculos derivados del estado del carrito.
  // Se realizan en cada render para asegurar consistencia.
  const subtotal = typeof total === "number" ? total : 0;
  const TAX_RATE = 0.16; // IVA 16%
  const SHIPPING_RATE = 350; // Costo de envío estándar
  const FREE_SHIPPING_THRESHOLD = 1000; // Envío gratis si subtotal >= 1000

  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const grandTotal = parseFloat(
    (subtotal + taxAmount + shippingCost).toFixed(2)
  );
  // debugger;
  const [isOrderFinished, setIsOrderFinished] = useState(false);

  // Utilidad para formatear moneda (MXN)
  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  // --- EFECTOS Y REFERENCIAS ---

  // Efecto de protección de ruta:
  // Si el carrito está vacío y no estamos en proceso de confirmación, redirigir al carrito.
  useEffect(() => {
    // debugger;
    if (!cartItems || cartItems.length === 0) {
      if (!isOrderFinished) {
        navigate("/cart");
      }
    }
  }, [cartItems, navigate, isOrderFinished]);

  // --- ESTADOS LOCALES (Gestión de UI y Datos) ---

  // Datos principales (Direcciones y Pagos)
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Estados de carga y error para la obtención inicial de datos
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Control de visibilidad de formularios (Modo Edición/Creación)
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Elementos que se están editando actualmente (null si es creación)
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  // Control de acordeones/secciones expandidas
  const [addressSectionOpen, setAddressSectionOpen] = useState(false);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(false);

  // Selección actual del usuario
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // --- CARGA DE DATOS INICIAL ---
  useEffect(() => {
    /**
     * Función asíncrona para cargar datos iniciales.
     * Obtiene direcciones y métodos de pago en paralelo.
     * Establece los valores por defecto si existen.
     */
    async function loadData() {
      setLoadingLocal(true);
      setLocalError(null);

      // Los servicios ya manejan sus propios errores y devuelven arrays vacíos
      // por lo que no necesitamos try-catch aquí
      const [addrList, firstAddress, payList, firstPayment] =
        await Promise.all([
          getShippingAddresses(),
          getDefaultShippingAddress(),
          getPaymentMethods(),
          getDefaultPaymentMethod(),
        ]);

      setAddresses(addrList || []);
      setPayments(payList || []);

      // Pre-seleccionar valores por defecto
      setSelectedAddress(firstAddress);
      setSelectedPayment(firstPayment);

      // Abrir secciones si no hay datos seleccionados
      setAddressSectionOpen(!firstAddress);
      setPaymentSectionOpen(!firstPayment);

      setLoadingLocal(false);
    }

    loadData();
  }, []);

  // --- HANDLERS PARA DIRECCIONES (CRUD Local) ---

  /**
   * Alterna la visibilidad de la sección de direcciones.
   * Cierra el formulario si estaba abierto.
   */
  const handleAddressToggle = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen((prev) => !prev);
  };

  /**
   * Selecciona una dirección existente y cierra el acordeón.
   * @param {Object} address - La dirección seleccionada.
   */
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };

  /**
   * Inicia el proceso de creación de una nueva dirección.
   * Abre el formulario en modo creación.
   */
  const handleAddressNew = () => {
    setShowAddressForm(true);
    setEditingAddress(null);
    setAddressSectionOpen(true);
  };

  /**
   * Inicia el proceso de edición de una dirección existente.
   * Abre el formulario precargado con los datos de la dirección.
   * @param {Object} address - La dirección a editar.
   */
  const handleAddressEdit = (address) => {
    setShowAddressForm(true);
    setEditingAddress(address);
    setAddressSectionOpen(true);
  };

  /**
   * Elimina una dirección de la lista local.
   * Si la dirección eliminada estaba seleccionada, intenta seleccionar otra.
   */
  const handleAddressDelete = async (address) => {
    try {
      await deleteShippingAddress(address._id);
      const updatedAddresses = addresses.filter((add) => add._id !== address._id);
      if (selectedAddress?._id === address._id) {
        setSelectedAddress(updatedAddresses[0] || null);
      }
      setAddresses(updatedAddresses);
      setNotification("Dirección eliminada");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification("Error al eliminar dirección");
    }
  };

  /**
   * Maneja el guardado (Creación o Edición) de una dirección.
   * Actualiza la lista local y la selección automáticamente para mejorar UX.
   */
  const handleAddressSubmit = async (formData) => {
    setLoadingLocal(true);
    try {
      let savedAddress;
      if (editingAddress) {
        savedAddress = await updateShippingAddress(editingAddress._id, formData);
        setAddresses(addresses.map(a => a._id === savedAddress._id ? savedAddress : a));
      } else {
        savedAddress = await createShippingAddress(formData);
        setAddresses([...addresses, savedAddress]);
      }

      setSelectedAddress(savedAddress);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressSectionOpen(false);
      setNotification("Dirección guardada correctamente");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification(err.message || "Error al guardar dirección");
    } finally {
      setLoadingLocal(false);
    }
  };

  /**
   * Cancela la operación actual (creación o edición) de dirección.
   * Cierra el formulario y limpia el estado de edición.
   */
  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };

  // --- HANDLERS PARA PAGOS (CRUD Local) ---

  /**
   * Alterna la visibilidad de la sección de pagos.
   * Cierra el formulario si estaba abierto.
   */
  const handlePaymentToggle = () => {
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen((prev) => !prev);
  };

  /**
   * Selecciona un método de pago existente y cierra el acordeón.
   * @param {Object} payment - El método de pago seleccionado.
   */
  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen(false);
  };

  /**
   * Inicia el proceso de creación de un nuevo método de pago.
   * Abre el formulario en modo creación.
   */
  const handlePaymentNew = () => {
    setShowPaymentForm(true);
    setEditingPayment(null);
    setPaymentSectionOpen(true);
  };

  /**
   * Inicia el proceso de edición de un método de pago existente.
   * Abre el formulario precargado con los datos del pago.
   * @param {Object} payment - El método de pago a editar.
   */
  const handlePaymentEdit = (payment) => {
    setShowPaymentForm(true);
    setEditingPayment(payment);
    setPaymentSectionOpen(true);
  };

  /**
   * Elimina un método de pago de la lista local.
   * Si el pago eliminado estaba seleccionado, intenta seleccionar otro.
   * @param {Object} payment - El método de pago a eliminar.
   */
  const handlePaymentDelete = async (payment) => {
    try {
      await deletePaymentMethod(payment._id);
      const updatedPayments = payments.filter((pay) => pay._id !== payment._id);
      if (selectedPayment?._id === payment._id) {
        setSelectedPayment(updatedPayments[0] || null);
      }
      setPayments(updatedPayments);
      setNotification("Método de pago eliminado");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification("Error al eliminar método de pago");
    }
  };

  /**
   * Maneja el guardado (Creación o Edición) de un método de pago.
   * Actualiza la lista local y la selección automáticamente.
   * @param {Object} formData - Datos del formulario de pago.
   */
  const handlePaymentSubmit = async (formData) => {
    setLoadingLocal(true);
    try {
      let savedPayment;
      if (editingPayment) {
        savedPayment = await updatePaymentMethod(editingPayment._id, formData);
        setPayments(payments.map(p => p._id === savedPayment._id ? savedPayment : p));
      } else {
        savedPayment = await createPaymentMethod(formData);
        setPayments([...payments, savedPayment]);
      }

      setSelectedPayment(savedPayment);
      setShowPaymentForm(false);
      setEditingPayment(null);
      setPaymentSectionOpen(false);
      setNotification("Método de pago guardado correctamente");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification(err.message || "Error al guardar método de pago");
    } finally {
      setLoadingLocal(false);
    }
  };

  /**
   * Cancela la operación actual (creación o edición) de pago.
   * Cierra el formulario y limpia el estado de edición.
   */
  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen(false);
  };

  // --- FINALIZACIÓN DE ORDEN ---

  /**
   * Crea la orden real en el servidor.
   * Maneja errores de stock y de red.
   */
  const handleCreateOrder = async () => {
    if (
      !selectedAddress ||
      !selectedPayment ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setNotification("Debes iniciar sesión para realizar la compra");
      return;
    }

    setLoadingLocal(true);
    setNotification("Procesando tu pedido...");

    try {
      const orderPayload = {
        user: currentUser._id || currentUser.id,
        products: cartItems.map((item) => ({
          productId: item.productId?._id || item.productId || item._id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: selectedAddress._id || selectedAddress.id,
        paymentMethod: selectedPayment._id || selectedPayment.id,
        shippingCost: shippingCost,
        totalPrice: Number(subtotal) + Number(shippingCost)
      };

      console.log("Order Payload:", orderPayload);

      const createdOrder = await apiCreateOrder(orderPayload);

      if (createdOrder && (createdOrder._id || createdOrder.id)) {
        setIsOrderFinished(true);
        setNotification("¡Compra realizada con éxito!");

        setTimeout(() => {
          navigate("/order-confirmation", { state: { order: createdOrder } });
          clearCart();
          setNotification(null);
        }, 2000);
      } else {
        throw new Error("Invalid order response from server");
      }
    } catch (err) {
      console.error("Error al crear la orden:", err);
      const msg = err.response?.data?.message || err.message || "Error al procesar la compra";
      setNotification(msg);
      setLoadingLocal(false);
    }
  };

  return (
    // Mostrar loading o error antes del contenido principal
    loadingLocal ? (
      <Loading>Cargando direcciones y métodos de pago...</Loading>
    ) : localError ? (
      <ErrorMessage>{localError}</ErrorMessage>
    ) : (
      <div className="checkout-container checkout-content-container">
        {notification && (
          <div className="checkout-notification">
            {notification}
          </div>
        )}
        <div className="checkout-left">
          <SummarySection
            title="1. Dirección de envío"
            selected={selectedAddress}
            summaryContent={
              <div className="selected-address">
                <p>{selectedAddress?.name}</p>
                <p>{selectedAddress?.address1}</p>
                <p>
                  {selectedAddress?.city}, {selectedAddress?.postalCode}
                </p>
              </div>
            }
            isExpanded={
              showAddressForm || addressSectionOpen || !selectedAddress
            }
            onToggle={handleAddressToggle}
          >
            {!showAddressForm && !editingAddress ? (
              <AddressList
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelect={handleSelectAddress}
                onEdit={handleAddressEdit}
                onAdd={handleAddressNew}
                onDelete={handleAddressDelete}
              />
            ) : (
              <AddressForm
                onSubmit={handleAddressSubmit}
                onCancel={handleCancelAddress}
                initialValues={editingAddress || {}}
                isEdit={!!editingAddress}
              />
            )}
          </SummarySection>

          <SummarySection
            title="2. Método de pago"
            selected={selectedPayment}
            summaryContent={
              <div className="selected-payment">
                <p>{selectedPayment?.alias}</p>
                <p>**** {selectedPayment?.cardNumber?.slice(-4) || "----"}</p>
              </div>
            }
            isExpanded={
              showPaymentForm || paymentSectionOpen || !selectedPayment
            }
            onToggle={handlePaymentToggle}
          >
            {!showPaymentForm && !editingPayment ? (
              <PaymentList
                payments={payments}
                selectedPayment={selectedPayment}
                onSelect={handleSelectPayment}
                onEdit={handlePaymentEdit}
                onAdd={handlePaymentNew}
                onDelete={handlePaymentDelete}
              />
            ) : (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onCancel={handleCancelPayment}
                initialValues={editingPayment || {}}
                isEdit={!!editingPayment}
              />
            )}
          </SummarySection>

          <SummarySection
            title="3. Revisa tu pedido"
            selected={true}
            isExpanded={true}
          >
            <CartView />
          </SummarySection>
        </div>

        <div className="checkout-right">
          <div className="checkout-summary">
            <h3>Resumen de la Orden</h3>
            <div className="summary-details">
              <p>
                <strong>Dirección de envío:</strong> {selectedAddress?.name}
              </p>
              <p>
                <strong>Método de pago:</strong> {selectedPayment?.alias}
              </p>
              <div className="order-costs">
                <p>
                  <strong>Subtotal:</strong> {formatMoney(subtotal)}
                </p>
                <p>
                  <strong>IVA (16%):</strong> {formatMoney(taxAmount)}
                </p>
                <p>
                  <strong>Envío:</strong>{" "}
                  {shippingCost === 0 ? "Gratis" : formatMoney(shippingCost)}
                </p>
                <hr />
                <p>
                  <strong>Total:</strong> {formatMoney(grandTotal)}
                </p>
              </div>
              <p>
                <strong>Fecha estimada de entrega:</strong>{" "}
                {new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            <Button
              className="pay-button"
              disabled={
                !selectedAddress?._id ||
                !selectedPayment?._id ||
                !cartItems ||
                cartItems.length === 0
              }
              data-testid="confirm-payment-btn"
              title={
                !cartItems || cartItems.length === 0
                  ? "No hay productos en el carrito"
                  : !selectedAddress?._id
                    ? "Selecciona una dirección de envío válida"
                    : !selectedPayment?._id
                      ? "Selecciona un método de pago válido"
                      : "Confirmar y realizar el pago"
              }
              onClick={handleCreateOrder}
            >
              Confirmar y Pagar
            </Button>
          </div>
        </div>
      </div>
    )
  );
}

