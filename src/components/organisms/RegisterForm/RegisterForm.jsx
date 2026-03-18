import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../atoms/Button";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import Input from "../../atoms/Input";
import "./RegisterForm.css";

/**
 * Componente funcional para el formulario de registro de nuevos usuarios.
 */
export default function RegisterForm() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();
    const { register } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación de coincidencia de contraseñas
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const result = await register(displayName, email, password);
            
            if (result.success) {
                // Redirige al login tras registro exitoso para que el usuario inicie sesión.
                navigate("/login");
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Crear Cuenta</h2>
                <form className="register-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <Input
                            id="displayName"
                            label="Nombre Completo: "
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            id="email"
                            label="Email: "
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu email"
                            required
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            id="password"
                            label="Contraseña: "
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Crea una contraseña"
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            id="confirmPassword"
                            label="Confirmar Contraseña: "
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <Button disabled={loading} type="submit" variant="primary">
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </Button>
                </form>

                <div className="register-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </div>
            </div>
        </div>
    );
}
