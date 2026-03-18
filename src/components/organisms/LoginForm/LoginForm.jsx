// Importa hooks y componentes necesarios para el formulario de login.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../atoms/Button";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import Input from "../../atoms/Input";
import "./LoginForm.css";

// Componente funcional para el formulario de inicio de sesión.
export default function LoginForm() {
  // Estado para el email del usuario.
  const [email, setEmail] = useState("");
  // Estado para la contraseña del usuario.
  const [password, setPassword] = useState("");
  // Estado para mostrar spinner de carga.
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mostrar mensajes de error.
  const [error, setError] = useState("");
  // Hook para navegar entre rutas.
  const navigate = useNavigate();
  const { login } = useAuth();

  // Función que maneja el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarga de la página.
    setError(""); // Limpia errores previos.

    // Validación básica.
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true); // Activa el spinner.

    try {
      // Simula retardo de red.
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Llama a la función de login con email y password.
      const result = await login(email, password);

      // Si el login es exitoso, navega al home.
      if (result.success) {
        navigate("/");
      } else {
        // Si falla, muestra el mensaje de error.
        setError(result.error);
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false); // Desactiva el spinner.
    }
  };

  // Renderiza el formulario de login.
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        {/* Usuarios de prueba para facilitar el acceso */}
        <div className="demo-users">
          <h4>Usuarios de prueba:</h4>
          <div className="user-demo">
            <strong>Cliente:</strong> cliente@email.com / cliente123
          </div>
          <div className="user-demo">
            <strong>Admin:</strong> admin@email.com / admin123
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* Campo de email */}
            <Input
              id="email"
              label="Email: "
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ingresa tu email"
              required
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              title="Por favor ingresa un correo electrónico válido."
            />
          </div>
          <div className="form-group">
            {/* Campo de contraseña */}
            <Input
              id="password"
              label="Contraseña: "
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              minLength="6"
              title="La contraseña debe tener al menos 6 caracteres."
            />
          </div>

          {/* Muestra mensaje de error si existe */}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Botón para enviar el formulario */}
          <Button disabled={isLoading} type="submit" variant="primary">
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        {/* Enlace para volver al inicio */}
        <div className="login-footer">
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
