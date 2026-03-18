
// Importa hooks y componentes necesarios para el header.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import Navigation from "../Navigation/Navigation";
import "./Header.css";

// Componente principal del Header, incluye navegación, búsqueda y usuario.
export default function Header() {
  // Estado para menús y búsqueda.
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Tema y carrito desde contextos.
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated: isAuth, logout } = useAuth();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  // Referencias para detectar clicks fuera de menús.
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);


  // Cierra menús con Escape y clicks fuera.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus en input de búsqueda móvil al abrir.
  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Prevenir scroll del body cuando el menú móvil está abierto.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Maneja la búsqueda de productos.
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (query.length === 0) {
      navigate("/search");
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Acciones de login, registro y logout.
  const handleLogin = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleRegister = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  // Toggle de menús.
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMobileMenuOpen = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Genera iniciales del usuario para el avatar.
  const getUserInitials = (userData) => {
    if (!userData) return "U";
    const name =
      userData.displayName || userData.name || userData.email || "Usuario";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtiene el nombre a mostrar del usuario.
  const getDisplayName = (userData) => {
    if (!userData) return "Usuario";
    return userData.displayName || userData.name || userData.email || "Usuario";
  };

  // Renderiza el header completo con navegación, búsqueda y menús.
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
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                <Icon name="arrowLeft" size={20} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="mobile-search-btn"
                aria-label="Buscar"
              >
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
            <button
              className="mobile-menu-btn mobile-only"
              aria-label="Abrir menú"
              onClick={handleMobileMenuOpen}
            >
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
                <button
                  type="submit"
                  className="search-btn"
                  aria-label="Buscar"
                >
                  <Icon name="search" size={18} />
                </button>
              </form>
            </div>
            {/* Acciones a la derecha */}
            <div className="header-actions">
              {/* Botón búsqueda móvil */}
              <button
                className="mobile-search-trigger mobile-only"
                aria-label="Buscar"
                onClick={handleMobileSearchToggle}
              >
                <Icon name="search" size={20} />
              </button>

              {/* Menú de usuario desktop */}
              <div
                className="user-menu-container desktop-only"
                ref={userMenuRef}
              >
                <button
                  className={`user-info ${isUserMenuOpen ? "active" : ""}`}
                  onClick={handleUserMenuToggle}
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    <span className="user-initials">
                      {isAuth ? (
                        getUserInitials(user)
                      ) : (
                        <Icon name="user" size={16} />
                      )}
                    </span>
                  </div>
                  <div className="user-text">
                    <span className="greeting">
                      {isAuth
                        ? `Hola, ${getDisplayName(user)}`
                        : "Hola, Inicia sesión"}
                    </span>
                    <span className="account-text">
                      {isAuth ? "Mi Cuenta" : "Cuenta y Listas"}
                    </span>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={14}
                    className={`dropdown-arrow ${isUserMenuOpen ? "rotated" : ""
                      }`}
                  />
                </button>

                {/* Dropdown de usuario desktop */}
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {!isAuth ? (
                      <div className="auth-section">
                        <div className="auth-header">
                          <Icon name="user" size={24} />
                          <span>Accede a tu cuenta</span>
                        </div>
                        <Link
                          to="/login"
                          className="auth-btn primary"
                          onClick={handleLogin}
                        >
                          <Icon name="logIn" size={16} />
                          Iniciar Sesión
                        </Link>
                        <Link
                          to="/register"
                          className="auth-btn secondary"
                          onClick={handleRegister}
                        >
                          <Icon name="userPlus" size={16} />
                          Crear Cuenta
                        </Link>
                      </div>
                    ) : (
                      <div className="user-section">
                        <div className="user-profile">
                          <div className="user-avatar large">
                            <span className="user-initials">
                              {getUserInitials(user)}
                            </span>
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {getDisplayName(user)}
                            </span>
                            <span className="user-email">{user?.email}</span>
                          </div>
                        </div>

                        <div className="user-links">
                          <Link to="/profile" className="user-link">
                            <Icon name="user" size={16} />
                            Mi Cuenta
                          </Link>
                          <Link to="/orders" className="user-link">
                            <Icon name="package" size={16} />
                            Mis Pedidos
                          </Link>
                          <Link to="/wishlist" className="user-link">
                            <Icon name="heart" size={16} />
                            Lista de Deseos
                          </Link>
                          <Link to="/settings" className="user-link">
                            <Icon name="settings" size={16} />
                            Configuración
                          </Link>
                        </div>

                        <div className="logout-section">
                          <button className="logout-btn" onClick={handleLogout}>
                            <Icon name="logOut" size={16} />
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón de Pedidos Prominente (Solo Autenticados) */}
              {isAuth && (
                <Link
                  to="/orders"
                  className="header-action-btn desktop-only"
                  aria-label="Ver mis pedidos"
                  title="Mis Pedidos"
                >
                  <Icon name="package" size={22} />
                  <span className="action-label">Pedidos</span>
                </Link>
              )}

              {/* Botón de carrito */}
              <Link
                to="/cart"
                className="cart-btn"
                aria-label="Ver carrito de compras"
              >
                <Icon name="shoppingCart" size={24} />
                <span className="cart-badge">{totalItems}</span>
              </Link>

              {/* Botón para cambiar tema desktop */}
              <button
                className="theme-btn desktop-only"
                onClick={toggleTheme}
                aria-pressed={isDarkMode}
                aria-label="Cambiar tema"
              >
                <Icon name={isDarkMode ? "sun" : "moon"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de navegación principal */}
      <Navigation />

      {/* Menú móvil mejorado */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={handleMobileMenuClose}>
          <div
            className="mobile-menu-content"
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del menú móvil */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <span className="logo">Triplay y Maderas Finas.mx</span>
              </div>
              <button
                className="mobile-menu-close"
                aria-label="Cerrar menú"
                onClick={handleMobileMenuClose}
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            {/* Contenido del menú móvil */}
            <div className="mobile-menu-body">
              {/* Sección de usuario */}
              <div className="mobile-user-section">
                {!isAuth ? (
                  <div className="mobile-auth-section">
                    <div className="mobile-auth-header">
                      <Icon name="user" size={32} />
                      <div>
                        <h3>¡Hola!</h3>
                        <p>Inicia sesión para una mejor experiencia</p>
                      </div>
                    </div>
                    <div className="mobile-auth-buttons">
                      <Link
                        to="/login"
                        className="mobile-auth-btn primary"
                        onClick={handleLogin}
                      >
                        <Icon name="logIn" size={20} />
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        className="mobile-auth-btn secondary"
                        onClick={handleRegister}
                      >
                        <Icon name="userPlus" size={20} />
                        Crear Cuenta
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {
                        <span className="user-initials">
                          {getUserInitials(user)}
                        </span>
                      }
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">
                        {getUserInitials(user)}
                      </span>
                      <span className="mobile-user-email">{user?.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navegación por categorías principal */}
              <nav className="mobile-categories-nav">
                <h4>Compra por Categoría</h4>
                <Navigation
                  isMobile={true}
                  onLinkClick={handleMobileMenuClose}
                />
              </nav>

              {/* Enlaces de cuenta de usuario si está autenticado */}
              {isAuth && (
                <nav className="mobile-main-nav">
                  <h4>Mi Cuenta</h4>
                  <Link
                    to="/profile"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="user" size={20} />
                    Mi Perfil
                  </Link>
                  <Link
                    to="/orders"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="package" size={20} />
                    Mis Pedidos
                  </Link>
                  <Link
                    to="/wishlist"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="heart" size={20} />
                    Lista de Deseos
                  </Link>
                  <Link
                    to="/settings"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="settings" size={20} />
                    Configuración
                  </Link>
                </nav>
              )}

              {/* Configuración y soporte */}
              <nav className="mobile-support-nav">
                <h4>Configuración y Ayuda</h4>
                <button className="mobile-nav-link" onClick={toggleTheme}>
                  <Icon name={isDarkMode ? "sun" : "moon"} size={20} />
                  <span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
                </button>
                <Link
                  to="/help"
                  className="mobile-nav-link"
                  onClick={handleMobileMenuClose}
                >
                  <Icon name="helpCircle" size={20} />
                  Centro de Ayuda
                </Link>
                <Link
                  to="/contact"
                  className="mobile-nav-link"
                  onClick={handleMobileMenuClose}
                >
                  <Icon name="messageCircle" size={20} />
                  Contactar Soporte
                </Link>
              </nav>

              {/* Logout */}
              {isAuth && (
                <div className="mobile-logout-section">
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <Icon name="logOut" size={20} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
