import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../services/auth";
import Button from "../../atoms/Button";
import "./ProfileCard.css";

// Componente principal para mostrar la tarjeta de perfil de usuario.
export default function ProfileCard({ user }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user || getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState("");
  const role = currentUser?.role || "guest";

  // Acciones disponibles según el rol del usuario.
  const ROLE_ACTIONS = {
    admin: [
      { label: "Ver todos los pedidos", action: () => navigate("/orders") },
      { label: "Configuración", action: () => navigate("/settings") },
      { label: "Panel de administración", action: () => { 
          alert("El panel de administración está en desarrollo para esta versión.");
      } },
    ],
    customer: [
      { label: "Ver mis pedidos", action: () => navigate("/orders") },
      { label: "Favoritos", action: () => navigate("/wishlist") },
      { label: "Configuración", action: () => navigate("/settings") },
    ],
    cliente: [
      { label: "Ver mis pedidos", action: () => navigate("/orders") },
      { label: "Favoritos", action: () => navigate("/wishlist") },
      { label: "Configuración", action: () => navigate("/settings") },
    ],
  };

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

  if (!currentUser) {
    return <div className="profile-container"><p>Cargando perfil...</p></div>;
  }

  // Renderiza la tarjeta de perfil.
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Encabezado con avatar y nombre */}
        <div className="profile-header">
          <img
            src={currentUser.avatar || "/img/user-placeholder.png"}
            alt={currentUser.displayName || currentUser.name || currentUser.email}
            className="profile-avatar"
            onError={(e) => { e.target.src = "/img/user-placeholder.png"; }}
          />
          <div className="profile-names">
            <h2>{currentUser.displayName || currentUser.name || currentUser.email}</h2>
            <span className={`profile-role-badge profile-role-badge--${role}`}>
              {role}
            </span>
          </div>
        </div>

        {/* Formulario para cambiar la imagen de perfil */}
        <form onSubmit={handleAvatarChange} className="profile-avatar-form">
          <label htmlFor="avatarUrl">Actualizar URL de avatar:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="url"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="profile-avatar-input"
              style={{ flex: 1 }}
            />
            <Button type="submit" size="sm">Actualizar</Button>
          </div>
        </form>

        {/* Información del usuario */}
        <div className="profile-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{currentUser.email || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Nombre de usuario:</label>
            <span>{currentUser.displayName || currentUser.name || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Rol de cuenta:</label>
            <span style={{ textTransform: 'capitalize' }}>{role}</span>
          </div>
        </div>

        {/* Acciones de la cuenta */}
        <div className="profile-actions">
          <h3>Gestión de Cuenta</h3>
          <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {actions.map((action, idx) => (
              <Button key={idx} type="button" variant="outline" onClick={action.action}>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
