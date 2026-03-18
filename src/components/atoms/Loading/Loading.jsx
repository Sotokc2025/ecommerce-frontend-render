// Importa los estilos CSS para el componente de carga.
import "./Loading.css";

// Componente funcional que muestra un spinner de carga y texto opcional.
export default function Loading({children}) {
  // Renderiza el contenedor con el spinner y el texto de carga.
  return (
    <div className="loading-container">
      {/* Spinner animado */}
      <div className="loading-spinner" aria-label="Cargando" />
      {/* Texto opcional debajo del spinner */}
      <span className="loading-text">{children}</span>
    </div>
  );
}