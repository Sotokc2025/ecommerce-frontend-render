
// Importa Link para navegación interna y Icon para íconos sociales y de pago.
import { Link, useLocation } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import "./Footer.css";

// Componente Footer para mostrar el pie de página completo.
export default function Footer() {
  // Obtiene la ubicación actual para mostrar secciones solo en la home.
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Renderiza el pie de página con secciones condicionales.
  return (
    <footer className="footer">
      {/* Sección principal del footer solo en home */}
      {isHome && (
        <section className="footer-main">
          <div className="container">
            <div className="footer-content">
              {/* Información de la empresa */}
              <div className="footer-section">
                <div className="footer-logo">
                  <Link to="/" className="logo">
                    Triplay y Maderas Finas
                  </Link>
                </div>
                <p className="footer-description">
                  Especialistas en maderas, triplay y productos finos para carpintería, construcción y decoración. Calidad, variedad y asesoría profesional.
                </p>
                {/* Enlaces a redes sociales */}
                <div className="social-links">
                  <h4>Visítanos en:</h4>
                  <div className="social-icons">
                    <Link to="https://www.facebook.com/TriplayyMaderas" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                      <Icon name="facebook" size={20} />
                    </Link>
                    <Link to="https://www.instagram.com/triplayymaderasdemayoreo/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                      <Icon name="instagram" size={20} />
                    </Link>
                    <Link to="#" aria-label="TikTok">
                      <Icon name="tiktok" size={20} />
                    </Link>
                    <Link to="#" aria-label="WhatsApp">
                      <Icon name="whatsapp" size={20} />
                    </Link>
                  </div>
                </div>
              </div>
              {/* Enlaces de categorías */}
              <div className="footer-section categorias">
                <h3>Categorías</h3>
                <ul>
                  <li><Link to="#">Triplay</Link></li>
                  <li><Link to="#">Maderas Finas</Link></li>
                  <li><Link to="#">Herramientas</Link></li>
                  <li><Link to="#">Accesorios</Link></li>
                  <li><Link to="#">Ofertas</Link></li>
                </ul>
              </div>
              {/* Enlaces de atención al cliente */}
              <div className="footer-section atencion">
                <h3>Atención al Cliente</h3>
                <ul>
                  <li><Link to="#">¿Cómo Comprar?</Link></li>
                  <li><Link to="#">Envíos y Devoluciones</Link></li>
                  <li><Link to="#">Manual de Maderas</Link></li>
                  <li><Link to="#">Contacto</Link></li>
                  <li><Link to="#">Garantía de Calidad</Link></li>
                </ul>
              </div>
              {/* Enlaces de empresa */}
              <div className="footer-section empresa">
                <h3>Empresa</h3>
                <ul>
                  <li><Link to="#">Sobre Nosotros</Link></li>
                  <li><Link to="#">Trabaja con Nosotros</Link></li>
                  <li><Link to="#">Responsabilidad Social</Link></li>
                  <li><Link to="#">Sostenibilidad</Link></li>
                  <li><Link to="#">Blog de Madera</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Sección de confianza solo en home */}
      {isHome && (
        <section className="footer-trust">
          <div className="container">
            <div className="trust-content">
              <div className="trust-item">
                <Icon name="checkCircle" size={24} />
                <div>
                  <strong>Compra Asegurada</strong>
                  <span>Protegemos tus productos</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="lock" size={24} />
                <div>
                  <strong>Tus datos están protegidos</strong>
                  <span>Tu información está segura</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="truck" size={24} />
                <div>
                  <strong>Envíos Rápidos</strong>
                  <span>A todo México</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="map" size={24} />
                <div>
                  <strong>A todo México</strong>
                  <span>Envíos nacionales</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="headphones" size={24} />
                <div>
                  <strong>Te apoyamos 24/7</strong>
                  <span>Atención al cliente</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Sección de métodos de pago y contacto solo en home */}
      {isHome && (
        <section className="footer-payment">
          <div className="container">
            <div className="payment-content">
              <div className="payment-section">
                <h4>Métodos de Pago</h4>
                <div className="payment-icons">
                  <Icon name="visa" size={32} />
                  <Icon name="mastercard" size={32} />
                  <Icon name="amex" size={32} />
                  <Icon name="paypal" size={32} />
                  <Icon name="applepay" size={32} />
                  <Icon name="googlepay" size={32} />
                </div>
              </div>
              <div className="contact-info">
                <h4>Contacto</h4>
                <div className="contact-details">
                  <span>
                    <Icon name="phone" size={16} />
                    800-MADERAS-247
                  </span>
                  <span>
                    <Icon name="mail" size={16} />
                    contacto@triplaymaderas.com
                  </span>
                  <span>
                    <Icon name="clock" size={16} />
                    Lun-Sab 8:00-18:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Sección inferior del footer, siempre visible */}
      <section className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Triplay y Maderas Finas. Todos los derechos
              reservados.
            </p>
            <nav className="legal-links">
              <Link to="#">Política de Privacidad</Link>
              <Link to="#">Términos y Condiciones</Link>
              <Link to="#">Política de Cookies</Link>
              <Link to="#">Accesibilidad</Link>
              <Link to="#">Mapa del Sitio</Link>
            </nav>
          </div>
        </div>
      </section>
    </footer>
  );
}
