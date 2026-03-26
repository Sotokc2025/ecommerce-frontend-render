// @ts-check

// Importa los componentes necesarios para la vista de orden de compra
import CartView from "../components/organisms/Cart/CartView";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

// Componente principal PurchaseOrder
export default function PurchaseOrder() {

  // Lista de direcciones simuladas
  const addressList = [
    {
      name: "Home", // Nombre de la dirección
      address1: "Calle 1", // Calle principal
      address2: "Colonia 1", // Colonia
      postalCode: "20000", // Código postal
      city: "Aguascalientes", // Ciudad
      country: "México", // País
      reference: "Entre calle A y B", // Referencia
      default: true, // Indica si es la dirección predeterminada
    },
    {
      name: "Work",
      address1: "Calle 2",
      address2: "Colonia 2",
      postalCode: "20000",
      city: "Aguascalientes",
      country: "México",
      reference: "Entre calle A y B",
      default: false,
    },
  ];
  // Lista de métodos de pago simulados
  const paymentMethodList = [
    {
      alias: "Tarjeta1", // Alias de la tarjeta
      cardNumber: "4444-4444-4444-4444", // Número de tarjeta
      cardHolderName: "Rodrigo", // Titular
      expireDate: "08/31", // Fecha de expiración
      cvv: "123", // Código de seguridad
      default: true, // Indica si es el método predeterminado
    },
    {
      alias: "Tarjeta2",
      cardNumber: "4444-4444-4444-4444",
      cardHolderName: "Rodrigo",
      expireDate: "08/31",
      cvv: "123",
      default: false,
    },
  ];

  // Renderiza la vista de orden de compra
  return (
    <div className="order-container">
      {/* Sección izquierda: dirección y pago */}
      <div className="order-left">
        {/* Dirección de entrega */}
        <div className="order-address">
          <p>
            {/* Muestra la dirección predeterminada */}
            {addressList.find((a) => a.default === true).name}
            {addressList.find((a) => a.default === true).address1}
          </p>
          <Button>Cambiar</Button>
          <div className="address-list">
            <ul>
              {/* Lista todas las direcciones */}
              {addressList.map((addss) => {
                return (
                  <li>
                    <h3>{addss.name}</h3>
                    <p>{addss.address1}</p>
                    <p>{addss.address2}</p>
                    <p>{addss.postalCode}</p>
                    <p>{addss.city}</p>
                    <p>{addss.reference}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Formulario para agregar nueva dirección */}
          <form className="address-form">
            <Input label="name" type="text" />
            <Input label="address1" type="text" />
            <Input label="address2" type="text" />
            <Input label="postalCode" type="text" />
            <Input label="city" type="text" />
            <Input label="country" type="text" />
            <Input label="reference" type="text" />
            <label>Guardar como predeterminada: </label>
            <input type="check"></input>
            <Button>Guardar</Button>
          </form>
        </div>
        {/* Métodos de pago */}
        <div className="order-payment">
          <p>
            {/* Muestra el método de pago predeterminado */}
            {paymentMethodList.find((p) => p.default === true).alias}
            {paymentMethodList.find((p) => p.default === true).cardHolderName}
          </p>
          <Button>Cambiar</Button>
          <div className="payments-list">
            <ul>
              {/* Lista todos los métodos de pago */}
              {paymentMethodList.map((payment) => {
                return (
                  <li>
                    <h3>{payment.alias}</h3>
                    <p>{payment.cardHolderName}</p>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
        {/* Vista del carrito */}
        <CartView />
      </div>
      {/* Sección derecha: resumen y pago */}
      <div className="order-right">
        <h3>Total: </h3>
        <p>Fecha de entrega: </p>
        <Button>Pagar</Button>
      </div>
    </div>
  );
}
