// Importa el componente Button reutilizable.
import Button from "../../../atoms/Button";
// Importa los estilos CSS para la sección resumen.
import "./SummarySection.css";

// Componente funcional para mostrar una sección resumen en el checkout.
const SummarySection = ({
  title, // Título de la sección.
  selected, // Indica si la opción está seleccionada.
  summaryContent, // Contenido resumen a mostrar cuando está colapsado.
  isExpanded, // Indica si la sección está expandida.
  onToggle, // Función para expandir/colapsar la sección.
  children, // Contenido completo cuando está expandido.
}) => {
  // Maneja el evento de expandir/colapsar la sección.
  const handleToggle = (e) => {
    // Evita el toggle si el click fue en un botón.
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      return;
    }
    // Ejecuta la función de toggle si existe.
    if (onToggle) {
      onToggle();
    }
  };

  // Renderiza la sección resumen.
  return (
    <div className={`summary-section ${isExpanded ? "expanded" : ""}`}>
      {/* Encabezado de la sección, permite expandir/colapsar */}
      <div className="summary-header" onClick={handleToggle}>
        <div className="summary-title">
          <h3>{title}</h3> {/* Título de la sección */}
          {/* Si no está expandido y está seleccionada, muestra el resumen y botón cambiar */}
          {!isExpanded && selected && (
            <div className="summary-content">
              {summaryContent}
              <Button variant="text" size="small" onClick={onToggle}>
                Cambiar
              </Button>
            </div>
          )}
        </div>
        {/* Badge de selección si está seleccionada y no expandida */}
        {!isExpanded && selected && <div className="summary-badge">&#10003;</div>}
      </div>

      {/* Contenido expandido, muestra los children */}
      {isExpanded && <div className="summary-expanded-content">{children}</div>}
    </div>
  );
};

// Exporta el componente para su uso en otros archivos.
export default SummarySection;
