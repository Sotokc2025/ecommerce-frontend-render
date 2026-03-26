// @ts-check
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/organisms/Cart/CartView";
import AddressForm from "../components/organisms/Checkout/Address/AddressForm";
import AddressList from "../components/organisms/Checkout/Address/AddressList";
import SummarySection from "../components/organisms/Checkout/shared/SummarySection";
import Button from "../components/atoms/Button";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import Loading from "../components/atoms/Loading/Loading";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCheckout } from "../hooks/useCheckout";
import {
  getDefaultShippingAddress,
  getShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../services/shippingService";
import {
  getPaymentMethods,
  getDefaultPaymentMethod,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  createStripePaymentIntent 
} from "../services/paymentService";
import PaymentList from "../components/organisms/Checkout/Payment/PaymentList";
import PaymentForm from "../components/organisms/Checkout/Payment/PaymentForm";
import "./Checkout.css";

// STRIPE IMPORTS REDMOVED - POLAR.SH MOR USED INSTEAD

// Inicializar Stripe fuera del componente para evitar recreaciones
/**
 * @typedef {Object} ShippingAddress
 * @property {string} [_id] - ID único (MongoDB)
 * @property {string} [id] - ID único (Legacy)
 * @property {string} [name] - Nombre descriptivo (ej: Casa, Oficina)
 * @property {string} [address1] - Dirección línea 1
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {string} [postalCode] - Código postal (Alias de zipCode)
 * @property {string} country
 * @property {boolean} isDefault
 */



function CheckoutContent() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { 
    currentStep, 
    setCurrentStep, 
    isProcessing: isProcessingCheckout, 
    error: checkoutError, 
    processCheckout,
    orderResult
  } = useCheckout();



  const subtotal = totalPrice();
  const TAX_RATE = 0.16;
  const SHIPPING_RATE = 350;
  const FREE_SHIPPING_THRESHOLD = 5000; // Incrementado para ordenes Sayer-Lack

  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const grandTotal = parseFloat((subtotal + taxAmount + shippingCost).toFixed(2));
  
  const [isOrderFinished, setIsOrderFinished] = useState(false);
  const [notification, setNotification] = useState(/** @type {string | null} */ (null));

  /** @param {number} v */
  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      if (!isOrderFinished) navigate("/cart");
    }
  }, [cartItems, navigate, isOrderFinished]);

  const [addresses, setAddresses] = useState(/** @type {ShippingAddress[]} */ ([]));
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [localError, setLocalError] = useState(/** @type {string | null} */ (null));

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(/** @type {ShippingAddress | null} */ (null));
  const [addressSectionOpen, setAddressSectionOpen] = useState(false);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState(/** @type {ShippingAddress | null} */ (null));

  // Stripe local states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment local states
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoadingLocal(true);
      setLocalError(null);
      const [addrList, firstAddress, payList, firstPayment] = await Promise.all([
        getShippingAddresses(),
        getDefaultShippingAddress(),
        getPaymentMethods(),
        getDefaultPaymentMethod()
      ]);
      setAddresses(addrList || []);
      setSelectedAddress(firstAddress);
      setAddressSectionOpen(!firstAddress);

      setPayments(payList || []);
      setSelectedPayment(firstPayment);

      setLoadingLocal(false);
    }
    loadData();
  }, []);

  const handleAddressToggle = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen((prev) => !prev);
  };

  /** @param {ShippingAddress} address */
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };

  const handleAddressNew = () => {
    setShowAddressForm(true);
    setEditingAddress(null);
    setAddressSectionOpen(true);
  };

  /** @param {ShippingAddress} address */
  const handleAddressEdit = (address) => {
    setShowAddressForm(true);
    setEditingAddress(address);
    setAddressSectionOpen(true);
  };

  /** @param {ShippingAddress} address */
  const handleAddressDelete = async (address) => {
    try {
      const addressId = address._id || address.id;
      if (!addressId) return;
      await deleteShippingAddress(addressId);
      const updatedAddresses = addresses.filter((add) => (add._id || add.id) !== addressId);
      if ((selectedAddress?._id || selectedAddress?.id) === addressId) {
        setSelectedAddress(updatedAddresses[0] || null);
      }
      setAddresses(updatedAddresses);
      setNotification("Dirección eliminada");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification("Error al eliminar dirección");
    }
  };

  /** @param {any} formData */
  const handleAddressSubmit = async (formData) => {
    setLoadingLocal(true);
    try {
      /** @type {ShippingAddress} */
      let savedAddress;
      if (editingAddress) {
        const addrId = editingAddress._id || editingAddress.id;
        if (!addrId) throw new Error("ID de dirección no válido");
        savedAddress = await updateShippingAddress(addrId, formData);
        setAddresses(addresses.map(a => (a._id || a.id) === (savedAddress._id || savedAddress.id) ? savedAddress : a));
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
      const errorMsg = err instanceof Error ? err.message : "Error al guardar dirección";
      setNotification(errorMsg);
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };

  const handlePaymentToggle = () => {
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen((prev) => !prev);
  };

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen(false);
  };

  const handlePaymentNew = () => {
    setShowPaymentForm(true);
    setEditingPayment(null);
    setPaymentSectionOpen(true);
  };

  const handlePaymentEdit = (payment) => {
    setShowPaymentForm(true);
    setEditingPayment(payment);
    setPaymentSectionOpen(true);
  };

  const handlePaymentDelete = async (payment) => {
    try {
      const paymentId = payment._id || payment.id;
      if (!paymentId) return;
      await deletePaymentMethod(paymentId);
      const updatedPayments = payments.filter((p) => (p._id || p.id) !== paymentId);
      if ((selectedPayment?._id || selectedPayment?.id) === paymentId) {
        setSelectedPayment(updatedPayments[0] || null);
      }
      setPayments(updatedPayments);
      setNotification("Método de pago eliminado");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      setNotification("Error al eliminar método de pago");
    }
  };

  const handlePaymentSubmit = async (formData) => {
    setLoadingLocal(true);
    try {
      let savedPayment;
      if (editingPayment) {
        const payId = editingPayment._id || editingPayment.id;
        if (!payId) throw new Error("ID de pago no válido");
        savedPayment = await updatePaymentMethod(payId, formData);
        setPayments(payments.map(p => (p._id || p.id) === (savedPayment._id || savedPayment.id) ? savedPayment : p));
      } else {
        savedPayment = await addPaymentMethod(formData);
        setPayments([...payments, savedPayment]);
      }
      setSelectedPayment(savedPayment);
      setShowPaymentForm(false);
      setEditingPayment(null);
      setPaymentSectionOpen(false);
      setNotification("Método de pago guardado correctamente");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al guardar método de pago";
      setNotification(errorMsg);
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen(false);
  };

  const handleCreateOrder = async () => {
  if (!selectedAddress || !selectedPayment || !cartItems || cartItems.length === 0) {
    setNotification("Por favor selecciona una dirección y un método de pago.");
    return;
  }

    if (!user) {
      setNotification("Debes iniciar sesión para realizar la compra");
      return;
    }

    setIsProcessingPayment(true);
    setNotification("Validando stock y procesando pago seguro...");

    try {
      // 1. Crear Orden en Atlas (Modo Pendiente)
      const addressId = selectedAddress._id || selectedAddress.id;
      const paymentId = selectedPayment._id || selectedPayment.id;
      if (!addressId) throw new Error("Dirección de envío no válida");
      if (!paymentId) throw new Error("Método de pago no válido");

      const checkoutPayload = {
        shippingAddressId: addressId,
        paymentMethodId: paymentId,
        shippingCost: shippingCost
      };

      // 2. Ejecutar proceso de creación de orden con idempotencia
      const createdOrder = await processCheckout(checkoutPayload);

      if (!createdOrder || (!createdOrder._id && !createdOrder.id)) {
        throw new Error("Respuesta de orden inválida del servidor");
      }

      const orderId = createdOrder._id || createdOrder.id;

      // 3. Obtener URL de Checkout de Polar en lugar de PaymentIntent de Stripe
      setNotification("Redirigiendo a pasarela segura de TyMCO (Polar)...");
      const paymentResponse = await createStripePaymentIntent(orderId); // Mantenemos el nombre de la función para no romper contratos FE por ahora
      
      const checkoutUrl = paymentResponse.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("No se pudo obtener la URL de pago de Polar.");
      }

      // REDIRECCIÓN MAESTRA: Polar asume el control del pago y los impuestos (MoR)
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error("Error en checkout Senior (Polar):", err);
      // @ts-ignore
      const msg = err.response?.data?.message || err.message || "Error al procesar la compra. Intente nuevamente.";
      setNotification(msg);
    } finally {
      setIsProcessingPayment(false);
    }
  };



  return loadingLocal ? (
    <Loading>Cargando direcciones y checkout...</Loading>
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
          isExpanded={showAddressForm || addressSectionOpen || !selectedAddress}
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
              <p>{selectedPayment?.alias || "Tarjeta TDC/TDD"}</p>
              <p>Procesado por Polar.sh</p>
            </div>
          }
          isExpanded={showPaymentForm || paymentSectionOpen || !selectedPayment}
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
          summaryContent={null}
          onToggle={() => {}}
        >
          <CartView />
        </SummarySection>
      </div>

      <div className="checkout-right">
        <div className="checkout-summary">
          <h3>Resumen de la Orden</h3>
          <div className="summary-details">
            <p>
              <strong>Dirección de envío:</strong> {selectedAddress?.name || "No seleccionada"}
            </p>
            <p>
              <strong>Método de pago:</strong> {selectedPayment?.alias || "Seleccionada"} (Polar.sh)
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
                <strong>Total a Pagar:</strong> {formatMoney(grandTotal)}
              </p>
            </div>
          </div>
          <Button
            className="pay-button"
            disabled={
              !selectedAddress?._id ||
              !selectedPayment?._id ||
              !cartItems ||
              cartItems.length === 0 ||
              isProcessingPayment
            }
            onClick={handleCreateOrder}
          >
            {isProcessingPayment ? "Procesando..." : "Confirmar y Pagar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <CheckoutContent />
  );
}
