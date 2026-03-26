// @ts-check
// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa el componente PaymentItem para mostrar cada método de pago.
import PaymentItem from "./PaymentItem";
// Importa los estilos CSS para la lista de métodos de pago.
import "./PaymentList.css";

// Componente funcional que muestra la lista de métodos de pago.
const PaymentList = ({
  payments, // Array de métodos de pago.
  selectedPayment, // Método de pago seleccionado.
  onSelect, // Función para seleccionar un método de pago.
  onEdit, // Función para editar un método de pago.
  onDelete, // Función para eliminar un método de pago.
  onAdd, // Función para agregar un nuevo método de pago.
}) => {
  // Renderiza la lista de métodos de pago.
  return (
    <div className="payment-list">
      {/* Encabezado de la lista con título y botón para agregar */}
      <div className="payment-list-header">
        <h3>Métodos de Pago</h3>
        <Button onClick={onAdd}>Agregar Nueva Tarjeta</Button>
      </div>
      {/* Contenido de la lista: recorre los métodos de pago y renderiza cada uno */}
      <div className="payment-list-content">
        {payments.map((payment) => (
          <PaymentItem
            key={payment._id || payment.alias} // Clave única para React.
            payment={payment} // Datos del método de pago.
            isSelected={selectedPayment?._id === payment._id} // Indica si está seleccionado.
            onSelect={onSelect} // Función para seleccionar.
            onEdit={onEdit} // Función para editar.
            onDelete={onDelete} // Función para eliminar.
          />
        ))}
      </div>
    </div>
  );
};

// Exporta el componente para su uso en otros archivos.
export default PaymentList;
