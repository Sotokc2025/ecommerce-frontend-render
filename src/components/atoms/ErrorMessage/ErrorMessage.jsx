// @ts-check
// Importa los estilos CSS para el mensaje de error.
import "./ErrorMessage.css";

// Componente funcional que muestra un mensaje de error estilizado.
export default function ErrorMessage({ children }) {
  // Renderiza el mensaje de error dentro de un div con clase específica.
  return <div className="error-message">{children}</div>;
}
