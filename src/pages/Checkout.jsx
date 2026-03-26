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
import { createStripePaymentIntent } from "../services/paymentService";
import "./Checkout.css";

// STRIPE IMPORTS
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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

// @ts-ignore
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

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

  const stripe = useStripe();
  const elements = useElements();

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

  useEffect(() => {
    async function loadData() {
      setLoadingLocal(true);
      setLocalError(null);
      const [addrList, firstAddress] = await Promise.all([
        getShippingAddresses(),
        getDefaultShippingAddress(),
      ]);
      setAddresses(addrList || []);
      setSelectedAddress(firstAddress);
      setAddressSectionOpen(!firstAddress);
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

  const handleCreateOrder = async () => {
    if (!selectedAddress || !cartItems || cartItems.length === 0) return;
    if (!stripe || !elements) return;

    if (!user) {
      setNotification("Debes iniciar sesión para realizar la compra");
      return;
    }

    setIsProcessingPayment(true);
    setNotification("Validando stock y procesando pago seguro...");

    try {
      // 1. Crear Orden en Atlas (Modo Pendiente) a través del Hook Senior
      const addressId = selectedAddress._id || selectedAddress.id;
      if (!addressId) throw new Error("Dirección de envío no válida");

      const checkoutPayload = {
        shippingAddressId: addressId,
        paymentMethodId: undefined, // Se actualizará tras el cobro de Stripe
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

  // Opciones de estilo para Stripe CardElement
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': { color: '#aab7c4' },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
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
          title="2. Método de pago (Stripe)"
          selected={true} // Siempre mostrar expandido o validado
          summaryContent={
            <div className="selected-payment">
              <p>Tarjeta Bancaria</p>
              <p>Procesado de forma segura por Stripe</p>
            </div>
          }
          isExpanded={paymentSectionOpen}
          onToggle={() => setPaymentSectionOpen(!paymentSectionOpen)}
        >
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Ingresa los detalles de tu tarjeta:</p>
            <CardElement options={cardElementOptions} />
          </div>
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
              <strong>Método de pago:</strong> Stripe
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
              !cartItems ||
              cartItems.length === 0 ||
              isProcessingPayment ||
              !stripe
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
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}
