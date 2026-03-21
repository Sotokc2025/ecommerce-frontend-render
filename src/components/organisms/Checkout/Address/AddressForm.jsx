// Importa hooks de React para manejar estado y efectos.
import { useEffect, useState } from "react";
// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa el componente Input para los campos del formulario.
import Input from "../../../atoms/Input";
// Importa los estilos CSS del formulario de dirección.
import "./AddressForm.css";

// Componente funcional para el formulario de dirección de envío.
const AddressForm = ({
  onSubmit, // Función que se ejecuta al enviar el formulario.
  onCancel, // Función que se ejecuta al cancelar.
  initialValues = {}, // Valores iniciales para edición.
  isEdit = false, // Indica si es modo edición.
}) => {
  // Estado para los datos del formulario.
  const [formData, setFormData] = useState(() => {
    const base = {
      name: initialValues.name || "",
      address1: "",
      address2: "",
      postalCode: initialValues.postalCode || "",
      city: initialValues.city || "",
      state: initialValues.state || "",
      country: initialValues.country || "México",
      phone: initialValues.phone || "",
      reference: initialValues.reference || "",
      addressType: initialValues.addressType || "home",
      isDefault: initialValues.isDefault || false,
    };

    // Si viene 'address' del backend, lo separamos en address1 y address2
    if (initialValues.address) {
      const parts = initialValues.address.split(", ");
      base.address1 = parts[0] || "";
      base.address2 = parts.slice(1).join(", ") || "";
    }
    return base;
  });

  // Actualiza el formulario si cambian los valores iniciales (modo edición).
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      const parts = initialValues.address ? initialValues.address.split(", ") : ["", ""];
      setFormData({
        name: initialValues.name || "",
        postalCode: initialValues.postalCode || "",
        city: initialValues.city || "",
        state: initialValues.state || "",
        country: initialValues.country || "México",
        phone: initialValues.phone || "",
        reference: initialValues.reference || "",
        addressType: initialValues.addressType || "home",
        isDefault: initialValues.isDefault || false,
        address1: parts[0] || "",
        address2: parts.slice(1).join(", "),
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

    // Transformar datos para que coincidan con el backend
    // Backend espera "address" (singular), no "address1" y "address2"
    const backendData = {
      ...formData,
      address: formData.address2
        ? `${formData.address1}, ${formData.address2}`
        : formData.address1
    };

    // Eliminar campos que no espera el backend
    delete backendData.address1;
    delete backendData.address2;
    delete backendData.reference; // Backend no tiene este campo

    onSubmit(backendData);

    // Resetea el formulario si es nuevo (no edición).
    if (!isEdit) {
      setFormData({
        name: "",
        address1: "",
        address2: "",
        postalCode: "",
        city: "",
        state: "",
        country: "México",
        phone: "",
        reference: "",
        addressType: "home",
        isDefault: false,
      });
    }
  };

  // Renderiza el formulario de dirección.
  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? "Editar Dirección" : "Nueva Dirección"}</h3>

      {/* Campo: Nombre de la dirección */}
      <Input
        label="Nombre de la dirección"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        minLength="2"
        maxLength="100"
        title="El nombre debe tener entre 2 y 100 caracteres."
      />

      {/* Campo: Dirección Línea 1 */}
      <Input
        label="Dirección Línea 1"
        name="address1"
        value={formData.address1}
        onChange={handleChange}
        required
        minLength="5"
        maxLength="200"
        title="La dirección debe tener al menos 5 caracteres."
      />

      {/* Campo: Dirección Línea 2 */}
      <Input
        label="Dirección Línea 2"
        name="address2"
        value={formData.address2}
        onChange={handleChange}
      />

      {/* Campo: Código Postal */}
      <Input
        label="Código Postal"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        required
        pattern="[0-9]{4,6}"
        title="El código postal debe contener entre 4 y 6 números."
      />

      {/* Campo: Ciudad */}
      <Input
        label="Ciudad"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
        minLength="2"
        maxLength="50"
        pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
        title="La ciudad solo debe contener letras."
      />

      {/* Campo: Estado */}
      <Input
        label="Estado"
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
        minLength="2"
        maxLength="50"
        pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
        title="El estado solo debe contener letras."
      />

      {/* Campo: País */}
      <Input
        label="País"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
        minLength="2"
        maxLength="50"
        pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
        title="El país solo debe contener letras."
      />

      {/* Campo: Teléfono */}
      <Input
        label="Teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        minLength="10"
        maxLength="15"
        pattern="[0-9\+\s\(\)\-]+"
        title="El teléfono debe tener entre 10 y 15 caracteres (números, espacios, +, -, paréntesis)."
        placeholder="55-1234-5678"
      />

      {/* Campo: Referencia */}
      <Input
        label="Referencia"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        placeholder="Entre calles, frente a..."
      />

      {/* Campo: Tipo de Dirección */}
      <div className="form-group">
        <label htmlFor="addressType">Tipo de Dirección</label>
        <select
          name="addressType"
          id="addressType"
          value={formData.addressType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="home">Casa</option>
          <option value="work">Trabajo</option>
          <option value="other">Otro</option>
        </select>
      </div>

      {/* Checkbox para dirección predeterminada */}
      <div className="form-checkbox">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          id="defaultAddress"
        />
        <label htmlFor="defaultAddress">
          Establecer como dirección predeterminada
        </label>
      </div>

      {/* Botones de acción: guardar/cancelar */}
      <div className="form-actions">
        <Button type="submit">
          {isEdit ? "Guardar Cambios" : "Agregar Dirección"}
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
export default AddressForm;
