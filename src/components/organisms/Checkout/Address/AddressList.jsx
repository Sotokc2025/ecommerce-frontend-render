// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa el componente AddressItem para mostrar cada dirección.
import AddressItem from "./AddressItem";
// Importa los estilos CSS de la lista de direcciones.
import "./AddressList.css";

// Componente funcional que muestra la lista de direcciones de envío.
const AddressList = ({
  addresses, // Array de direcciones.
  selectedAddress, // Dirección seleccionada actualmente.
  onSelect, // Función para seleccionar una dirección.
  onEdit, // Función para editar una dirección.
  onDelete, // Función para eliminar una dirección.
  onAdd, // Función para agregar una nueva dirección.
}) => {
  return (
    <div className="address-list">
      {/* Encabezado de la lista con botón para agregar dirección */}
      <div className="address-list-header">
        <h3>Direcciones de Envío</h3>
        <Button onClick={onAdd}>Agregar Nueva Dirección</Button>
      </div>
      {/* Contenido: lista de direcciones */}
      <div className="address-list-content">
        {addresses.map((address) => (
          <AddressItem
            key={address._id || address.name}
            address={address}
            isSelected={selectedAddress?._id === address._id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

// Exporta el componente para su uso en otros archivos.
export default AddressList;
