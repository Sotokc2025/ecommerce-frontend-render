// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa los estilos CSS del ítem de dirección.
import "./AddressItem.css";

// Componente funcional que muestra una dirección de envío.
const AddressItem = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
  const parts = address.address ? address.address.split(", ") : ["", ""];
  const displayAddress1 = address.address1 || parts[0];
  const displayAddress2 = address.address2 || parts.slice(1).join(", ");

  return (
    <div
      className={`address-item ${isSelected ? "selected" : ""} ${address.default ? "default" : ""
        }`}
    >
      {/* Contenido de la dirección */}
      <div className="address-content">
        <h4>{address.name}</h4>
        <p>{displayAddress1}</p>
        {/* Muestra la segunda línea si existe */}
        {displayAddress2 && <p>{displayAddress2}</p>}
        <p>
          {address.city}, {address.postalCode}
        </p>
        {/* Muestra la referencia si existe */}
        {address.reference && <p>{address.reference}</p>}
        {/* Badge si es dirección predeterminada */}
        {address.default && (
          <span className="default-badge">Predeterminada</span>
        )}
      </div>
      {/* Acciones: seleccionar, editar, eliminar */}
      <div className="address-actions">
        <Button onClick={() => onSelect(address)} disabled={isSelected}>
          {isSelected ? "Seleccionada" : "Seleccionar"}
        </Button>
        <Button variant="secondary" onClick={() => onEdit(address)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(address)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en otros archivos.
export default AddressItem;
