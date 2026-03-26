// @ts-check
import { Link } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import Navigation from "../Navigation/Navigation";
import NotificationBell from "../../molecules/NotificationBell/NotificationBell";
import HealthPulse from "../../molecules/HealthPulse/HealthPulse";
import { useHeader } from "../../../hooks/useHeader";
import { getDisplayName, getUserInitials } from "../../../utils/userUtils";
import "./Header.css";

/**
 * Header Organism: Componente principal de navegación y búsqueda.
 * Implementa arquitectura Context 7 con lógica desacoplada en useHeader. 🛡️⚛️✨
 */
export default function Header() {
  const { state, actions, refs } = useHeader();
  const { isUserMenuOpen, isMobileMenuOpen, isMobileSearchOpen, searchQuery, isDarkMode, isAuth, user, totalItems } = state;
  const { toggleUserMenu, openMobileMenu, closeMobileMenu, toggleMobileSearch, handleSearch, handleLogout, toggleTheme, setSearchQuery } = actions;
  const { userMenuRef, mobileMenuRef, searchInputRef } = refs;

  return (
    <header className="header">
      {/* Overlay de búsqueda móvil */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <button
                type="button"
                className="mobile-search-back"
                onClick={toggleMobileSearch}
                aria-label="Cerrar búsqueda"
              >
                <Icon name="arrowLeft" size={20} />
              </button>
              <input
                ref={/** @type {any} */ (searchInputRef)}
                type="text"
                className="mobile-search-input"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mobile-search-btn" aria-label="Buscar">
                <Icon name="search" size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header principal */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Botón menú móvil */}
            <button className="mobile-menu-btn mobile-only" aria-label="Abrir menú" onClick={openMobileMenu}>
              <Icon name="menu" size={20} />
            </button>
            {/* Logo */}
            <Link to="/" className="logo">
              Triplay y Maderas Finas
              <span className="logo-extension">.mx</span>
            </Link>
            {/* Búsqueda desktop */}
            <div className="search-container desktop-only">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn" aria-label="Buscar">
                  <Icon name="search" size={18} />
                </button>
              </form>
            </div>
            {/* Acciones a la derecha */}
            <div className="header-actions">
              {/* HUD: Salud del Backend LEGACY */}
              <HealthPulse />

              {/* Botón búsqueda móvil */}
              <button className="mobile-search-trigger mobile-only" aria-label="Buscar" onClick={toggleMobileSearch}>
                <Icon name="search" size={20} />
              </button>

              {isAuth && (
                <div className="mobile-only" style={{ marginRight: '8px' }}>
                  <NotificationBell isMobile />
                </div>
              )}

              {/* Menú de usuario desktop */}
              <div
                className="user-menu-container desktop-only"
                ref={/** @type {any} */ (userMenuRef)}
              >
                <button
                  className={`user-info ${isUserMenuOpen ? "active" : ""}`}
                  onClick={toggleUserMenu}
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    <span className="user-initials">
                      {isAuth ? getUserInitials(user) : <Icon name="user" size={16} />}
                    </span>
                  </div>
                  <div className="user-text">
                    <span className="greeting">
                      {isAuth ? `Hola, ${getDisplayName(user)}` : "Hola, Inicia sesión"}
                    </span>
                    <span className="account-text">{isAuth ? "Mi Cuenta" : "Cuenta y Listas"}</span>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={14}
                    className={`dropdown-arrow ${isUserMenuOpen ? "rotated" : ""}`}
                  />
                </button>

                {/* Dropdown de usuario desktop */}
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {!isAuth ? (
                      <div className="auth-section">
                        <div className="auth-header"><Icon name="user" size={24} /><span>Accede a tu cuenta</span></div>
                        <Link to="/login" className="auth-btn primary"><Icon name="logIn" size={16} />Iniciar Sesión</Link>
                        <Link to="/register" className="auth-btn secondary"><Icon name="userPlus" size={16} />Crear Cuenta</Link>
                      </div>
                    ) : (
                      <div className="user-section">
                        <div className="user-profile">
                          <div className="user-avatar large">
                            <span className="user-initials">{getUserInitials(user)}</span>
                          </div>
                          <div className="user-details">
                            <span className="user-name">{getDisplayName(user)}</span>
                            <span className="user-email">{user?.email}</span>
                          </div>
                        </div>
                        <div className="user-links">
                          <Link to="/profile" className="user-link"><Icon name="user" size={16} />Mi Cuenta</Link>
                          <Link to="/orders" className="user-link"><Icon name="package" size={16} />Mis Pedidos</Link>
                          <Link to="/wishlist" className="user-link"><Icon name="heart" size={16} />Lista de Deseos</Link>
                          <Link to="/settings" className="user-link"><Icon name="settings" size={16} />Configuración</Link>
                        </div>
                        <div className="logout-section">
                          <button className="logout-btn" onClick={handleLogout}><Icon name="logOut" size={16} />Cerrar Sesión</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón de Pedidos Prominente */}
              {isAuth && (
                <Link to="/orders" className="header-action-btn desktop-only" aria-label="Ver pedidos" title="Pedidos">
                  <Icon name="package" size={22} /><span className="action-label">Pedidos</span>
                </Link>
              )}

              {/* Notificaciones */}
              {isAuth && <NotificationBell />}

              {/* Carrito */}
              <Link to="/cart" className="cart-btn" aria-label="Ver carrito">
                <Icon name="shoppingCart" size={24} /><span className="cart-badge">{totalItems}</span>
              </Link>

              {/* Tema */}
              <button className="theme-btn desktop-only" onClick={toggleTheme} aria-label="Tema">
                <Icon name={isDarkMode ? "sun" : "moon"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <Navigation onLinkClick={closeMobileMenu} />

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu-content" ref={/** @type {any} */ (mobileMenuRef)} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo"><span className="logo">Triplay y Maderas Finas.mx</span></div>
              <button className="mobile-menu-close" aria-label="Cerrar" onClick={closeMobileMenu}><Icon name="x" size={24} /></button>
            </div>
            <div className="mobile-menu-body">
              <div className="mobile-user-section">
                {!isAuth ? (
                  <div className="mobile-auth-section">
                    <div className="mobile-auth-header"><Icon name="user" size={32} /><div><h3>¡Hola!</h3><p>Inicia sesión</p></div></div>
                    <div className="mobile-auth-buttons">
                      <Link to="/login" className="mobile-auth-btn primary" onClick={closeMobileMenu}><Icon name="logIn" size={20} />Iniciar Sesión</Link>
                      <Link to="/register" className="mobile-auth-btn secondary" onClick={closeMobileMenu}><Icon name="userPlus" size={20} />Crear Cuenta</Link>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar"><span className="user-initials">{getUserInitials(user)}</span></div>
                    <div className="mobile-user-details"><span className="mobile-user-name">{getDisplayName(user)}</span><span className="mobile-user-email">{user?.email}</span></div>
                  </div>
                )}
              </div>
              <nav className="mobile-categories-nav">
                <h4>Compra por Categoría</h4>
                <Navigation isMobile={true} onLinkClick={closeMobileMenu} />
              </nav>
              {isAuth && (
                <nav className="mobile-main-nav">
                  <h4>Mi Cuenta</h4>
                  <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}><Icon name="user" size={20} />Mi Perfil</Link>
                  <Link to="/orders" className="mobile-nav-link" onClick={closeMobileMenu}><Icon name="package" size={20} />Mis Pedidos</Link>
                  <Link to="/wishlist" className="mobile-nav-link" onClick={closeMobileMenu}><Icon name="heart" size={20} />Lista de Deseos</Link>
                  <Link to="/settings" className="mobile-nav-link" onClick={closeMobileMenu}><Icon name="settings" size={20} />Configuración</Link>
                </nav>
              )}
              <nav className="mobile-support-nav">
                <h4>Ayuda</h4>
                <button className="mobile-nav-link" onClick={toggleTheme}><Icon name={isDarkMode ? "sun" : "moon"} size={20} /><span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span></button>
                <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}><Icon name="messageCircle" size={20} />Soporte</Link>
              </nav>
              {isAuth && (
                <div className="mobile-logout-section">
                  <button className="mobile-logout-btn" onClick={handleLogout}><Icon name="logOut" size={20} />Cerrar Sesión</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}