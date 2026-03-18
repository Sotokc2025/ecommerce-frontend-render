
// Importa Navigate para redirección y funciones de autenticación
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import "./ProtectedRoute.css";

// Componente ProtectedRoute para proteger rutas según autenticación y roles
export default function ProtectedRoute({
  children, // Componentes hijos a renderizar si pasa la validación
  redirectTo = "/login", // Ruta a la que se redirige si no está autenticado
  allowedRoles, // Roles permitidos para acceder a la ruta
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Si está cargando la sesión inicial, podemos mostrar un spinner o nada
  if (isLoading) {
    return <div className="loading-session">Cargando sesión...</div>;
  }

  // Verifica si el usuario está autenticado
  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to={redirectTo} />;
  }

  // Si hay restricción de roles
  if (allowedRoles) {
    // Verifica si el rol del usuario está permitido
    if (!allowedRoles.includes(user.role)) {
      // Si no tiene permisos, muestra mensaje de acceso denegado
      return (
        <div className="access-denied">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      );
    }
  }
  // Si pasa todas las validaciones, renderiza los hijos
  return children;
}