import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/organisms/Cart/CartView";
import AddressForm from "../components/organisms/Checkout/Address/AddressForm";
import AddressList from "../components/organisms/Checkout/Address/AddressList";
import SummarySection from "../components/organisms/Checkout/shared/SummarySection";
import Button from "../components/atoms/Button";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import Loading from "../components/atoms/Loading/Loading";
import { useCart } from "../context/CartContext";
import {
  getDefaultShippingAddress,
  getShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../services/shippingService";
import { createOrder as apiCreateOrder } from "../services/orderService";
import { createStripePaymentIntent } from "../services/paymentService";
import { getCurrentUser } from "../services/auth";
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
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function CheckoutContent() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();

  const stripe = useStripe();
  const elements = useElements();

  const subtotal = typeof total === "number" ? total : 0;
  const TAX_RATE = 0.16;
  const SHIPPING_RATE = 350;
  const FREE_SHIPPING_THRESHOLD = 1000;

  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const grandTotal = parseFloat((subtotal + taxAmount + shippingCost).toFixed(2));
  
  const [isOrderFinished, setIsOrderFinished] = useState(false);

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

  const [addresses, setAddresses] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [localError, setLocalError] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressSectionOpen, setAddressSectionOpen] = useState(false);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState(null);

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

  const handleAddressEdit = (address) => {
    setShowAddressForm(true);
    setEditingAddress(address);
    setAddressSectionOpen(true);
  };

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

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress || !cartItems || cartItems.length === 0) return;
    if (!stripe || !elements) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setNotification("Debes iniciar sesión para realizar la compra");
      return;
    }

    setIsProcessingPayment(true);
    setNotification("Procesando tu pedido y pago...");

    try {
      // 1. Guardar la orden en BD primero como pendiente
      const orderPayload = {
        user: currentUser._id || currentUser.id,
        products: cartItems.map((item) => ({
          productId: item.productId?._id || item.productId || item._id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: selectedAddress._id || selectedAddress.id,
        // Mandamos null u omitimos paymentMethod local ya que usaremos Stripe
        paymentMethod: null, 
        shippingCost: shippingCost,
        totalPrice: Number(subtotal) + Number(shippingCost)
      };

      const createdOrder = await apiCreateOrder(orderPayload);

      if (!createdOrder || (!createdOrder._id && !createdOrder.id)) {
        throw new Error("Respuesta de orden inválida del servidor");
      }

      const orderId = createdOrder._id || createdOrder.id;

      // 2. Crear PaymentIntent en Stripe
      const { clientSecret } = await createStripePaymentIntent(orderId);

      // 3. Confirmar pago con Stripe Element
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      // Pago Exitoso!
      if (paymentResult.paymentIntent.status === "succeeded") {
        setIsOrderFinished(true);
        setNotification("¡Compra y pago realizados con éxito!");

        setTimeout(() => {
          navigate("/order-confirmation", { state: { order: createdOrder } });
          clearCart();
          setNotification(null);
        }, 2000);
      }

    } catch (err) {
      console.error("Error en checkout:", err);
      const msg = err.response?.data?.message || err.message || "Error al procesar la compra";
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
