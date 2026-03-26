// @ts-check
// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa los estilos CSS para el ítem de pago.
import "./PaymentItem.css";

// Componente funcional que representa un método de pago individual.
const PaymentItem = ({ payment, isSelected, onSelect, onEdit, onDelete }) => {
  // Función para enmascarar el número de tarjeta, mostrando solo los últimos 4 dígitos.
  const maskCardNumber = (number) => {
    if (!number) return "**** **** **** ****"; // Si no hay número, muestra asteriscos.
    return `**** **** **** ${number.slice(-4)}`; // Muestra los últimos 4 dígitos.
  };

  // Renderiza el ítem de método de pago.
  return (
    <div
      className={`payment-item ${isSelected ? "selected" : ""} ${payment.isDefault ? "isDefault" : ""
        }`}
    >
      {/* Contenido principal del método de pago */}
      <div className="payment-content">
        <h4>{payment.alias}</h4> {/* Alias de la tarjeta */}
        <p>{maskCardNumber(payment.cardNumber)}</p> {/* Número de tarjeta enmascarado */}
        <p>Vence: {payment.expiryDate}</p> {/* Fecha de expiración */}
        <p>Titular: {payment.cardHolderName}</p> {/* Nombre del titular */}
        {/* Si es método predeterminado, muestra el badge */}
        {payment.isDefault && (
          <span className="isDefault-badge">Predeterminada</span>
        )}
      </div>
      {/* Acciones disponibles para el método de pago */}
      <div className="payment-actions">
        {/* Botón para seleccionar el método de pago */}
        <Button onClick={() => onSelect(payment)} disabled={isSelected}>
          {isSelected ? "Seleccionada" : "Seleccionar"}
        </Button>
        {/* Botón para editar el método de pago */}
        <Button variant="secondary" onClick={() => onEdit(payment)}>
          Editar
        </Button>
        {/* Botón para eliminar el método de pago */}
        <Button variant="danger" onClick={() => onDelete(payment)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en otros archivos.
export default PaymentItem;
