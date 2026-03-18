// Importa hooks de React para manejar estado y efectos.
import { useEffect, useState } from "react";
// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa el componente Input para los campos del formulario.
import Input from "../../../atoms/Input";
// Importa los estilos CSS del formulario de pago.
import "./PaymentForm.css";

// Componente funcional para el formulario de método de pago.
const PaymentForm = ({
  onSubmit, // Función que se ejecuta al enviar el formulario.
  onCancel, // Función que se ejecuta al cancelar.
  initialValues = {}, // Valores iniciales para edición.
  isEdit = false, // Indica si es modo edición.
}) => {
  // Estado para los datos del formulario.
  const [formData, setFormData] = useState({
    type: "credit_card",
    alias: "",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
    ...initialValues,
  });

  // Actualiza el formulario si cambian los valores iniciales (modo edición).
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        type: "credit_card",
        alias: "",
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
        isDefault: false,
        ...initialValues,
      });
    }
  }, [initialValues]);

  // Maneja el cambio de los campos del formulario.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Maneja el envío del formulario.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Transformar datos para backend
    // Backend NO espera: alias, cvv (el CVV nunca se almacena por seguridad)
    const backendData = {
      type: formData.type,
      cardNumber: formData.cardNumber,
      cardHolderName: formData.cardHolderName,
      expiryDate: formData.expiryDate,
      isDefault: formData.isDefault
    };

    onSubmit(backendData);

    // Resetea el formulario si es nuevo (no edición).
    if (!isEdit) {
      setFormData({
        type: "credit_card",
        alias: "",
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
        isDefault: false,
      });
    }
  };

  // Renderiza el formulario de método de pago.
  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? "Editar Método de Pago" : "Nuevo Método de Pago"}</h3>

      {/* Campo: Tipo de pago */}
      <div className="form-group">
        <label htmlFor="type">Tipo de pago</label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="debit_card">Tarjeta de Débito</option>
        </select>
      </div>

      {/* Campo: Alias de la tarjeta */}
      <Input
        label="Alias de la tarjeta (opcional)"
        name="alias"
        value={formData.alias}
        onChange={handleChange}
        minLength="3"
        maxLength="50"
        title="El alias debe tener entre 3 y 50 caracteres."
        placeholder="Mi tarjeta personal"
      />

      {/* Campo: Número de tarjeta */}
      <Input
        label="Número de tarjeta"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        pattern="^[0-9]{16}$"
        placeholder="1234567890123456"
        title="El número de tarjeta debe ser exactamente 16 dígitos sin espacios ni guiones."
        required
      />

      {/* Campo: Nombre del titular */}
      <Input
        label="Nombre del titular"
        name="cardHolderName"
        value={formData.cardHolderName}
        onChange={handleChange}
        required
        minLength="3"
        maxLength="100"
        pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
        title="Ingresa el nombre completo tal como aparece en la tarjeta."
        placeholder="Juan Pérez"
      />

      {/* Fila para fecha de expiración y CVV */}
      <div className="form-row">
        <Input
          label="Fecha de expiración"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          placeholder="MM/YY"
          pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$"
          title="Usa el formato MM/YY (ej. 12/26)."
          required
        />

        <Input
          label="CVV"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          type="password"
          maxLength="4"
          pattern="[0-9]{3,4}"
          required
        />
      </div>

      {/* Checkbox para método de pago predeterminado */}
      <div className="form-checkbox">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          id="isDefaultPayment"
        />
        <label htmlFor="isDefaultPayment">
          Establecer como método de pago predeterminado
        </label>
      </div>

      {/* Botones de acción: guardar/cancelar */}
      <div className="form-actions">
        <Button type="submit">
          {isEdit ? "Guardar Cambios" : "Agregar Método de Pago"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

// Exporta el componente para su uso en otros archivos.
export default PaymentForm;
