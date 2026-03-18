
// Importa función para obtener el usuario actual desde utilidades de autenticación.
import { useState } from "react";
import { getCurrentUser } from "../../../utils/auth";
// Importa el componente de botón reutilizable.
import Button from "../../atoms/Button";
// Importa los estilos CSS para la tarjeta de perfil.
import "./ProfileCard.css";

// Acciones disponibles según el rol del usuario.
const ROLE_ACTIONS = {
  admin: [
    { label: "Editar Perfil", action: () => { } },
    { label: "Cambiar contraseña", action: () => { } },
    { label: "Ver todos los pedidos", action: () => { } },
    { label: "Panel de administración", action: () => { } },
  ],
  customer: [
    { label: "Editar Perfil", action: () => { } },
    { label: "Cambiar contraseña", action: () => { } },
    { label: "Ver mis pedidos", action: () => { } },
  ],
};

// Componente principal para mostrar la tarjeta de perfil de usuario.
export default function ProfileCard({ user }) {
  // Obtiene el usuario actual, si no se pasa como prop.
  const [currentUser, setCurrentUser] = useState(user || getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState("");
  const role = currentUser.role || "guest";
  const actions = ROLE_ACTIONS[role] || [];

  // Maneja el cambio de imagen de perfil
  const handleAvatarChange = (e) => {
    e.preventDefault();
    if (!avatarUrl) return;
    const updatedUser = { ...currentUser, avatar: avatarUrl };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setAvatarUrl("");
  };

  // Renderiza la tarjeta de perfil.
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Encabezado con avatar y nombre */}
        <div className="profile-header">
          <img
            src={currentUser.avatar || "/img/user-placeholder.png"}
            alt={
              currentUser.displayName || currentUser.name || currentUser.email
            }
            className="profile-avatar"
          />
          <div className="profile-names">
            <h2>
              {currentUser.displayName || currentUser.name || currentUser.email}
            </h2>
            {/* Badge de rol con color dinámico */}
            <span
              className={`profile-role-badge profile-role-badge--${role}`}
            >
              {role}
            </span>
          </div>
        </div>
        {/* Formulario para cambiar la imagen de perfil */}
        <form onSubmit={handleAvatarChange} className="profile-avatar-form">
          <label htmlFor="avatarUrl">Pega la URL de tu nueva imagen:</label>
          <input
            type="url"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="profile-avatar-input"
            required
          />
          <Button type="submit">Cambiar imagen</Button>
        </form>
        {/* Información del usuario */}
        <div className="profile-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{currentUser.email || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Nombre:</label>
            <span>
              {currentUser.displayName || currentUser.name || "No disponible"}
            </span>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <span>{currentUser.isActive ? "Activo" : "Inactivo"}</span>
          </div>
          <div className="info-item">
            <label>Última conexión:</label>
            <span>
              {currentUser.loginDate
                ? new Date(currentUser.loginDate).toLocaleString()
                : "No disponible"}
            </span>
          </div>
        </div>
        {/* Acciones disponibles para el usuario */}
        <div className="profile-actions">
          <h3>Acciones de la cuenta</h3>
          {actions.map((action, idx) => (
            <Button key={idx} type="button" onClick={action.action}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
