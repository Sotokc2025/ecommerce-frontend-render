
// Importa React y el hook useState para manejar el estado del email.
import React, { useState } from "react";
import "./Newsletter.css";

// Componente Newsletter: muestra el formulario de suscripción al boletín.
export default function Newsletter() {
  // Estado para el email ingresado por el usuario.
  const [email, setEmail] = useState("");

  // Maneja el envío del formulario de newsletter.
  const handleNewsletterSubmit = (e) => {
    e.preventDefault(); // Evita recargar la página.
    console.log("Newsletter signup:", email); // Simula el registro del email.
    setEmail(""); // Limpia el campo de email tras enviar.
  };

  // Renderiza el formulario y texto de invitación.
  return (
    <section className="footer-newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>¡Suscríbete a nuestra App!</h3>
            <p>
              Recibe ofertas exclusivas y novedades directamente en tu email
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-group">
              {/* Input para el email del usuario */}
              <input
                type="email"
                className="newsletter-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* Botón para enviar el formulario */}
              <button type="submit" className="newsletter-btn">
                Suscribirse
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
