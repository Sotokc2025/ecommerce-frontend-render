// @ts-check
import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { checkEmail } from "../../../services/auth";
import Button from "../../atoms/Button";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import Input from "../../atoms/Input";
import "./RegisterForm.css";

/**
 * Componente funcional para el formulario de registro de nuevos usuarios.
 * Incluye validación en tiempo real del email con debounce.
 */
export default function RegisterForm() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Estado de validación de email en tiempo real
    const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid'
    const debounceTimer = useRef(null);

    const navigate = useNavigate();
    const { register } = useAuth();

    /**
     * Valida y verifica disponibilidad del email con debounce de 600ms.
     */
    const handleEmailChange = useCallback((e) => {
        const val = e.target.value;
        setEmail(val);
        setEmailStatus(null);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Formato básico requerido antes de consultar el servidor
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return;

        setEmailStatus("checking");
        debounceTimer.current = setTimeout(async () => {
            const isTaken = await checkEmail(val);
            if (isTaken === null) {
                setEmailStatus(null); // Error silencioso
            } else {
                setEmailStatus(isTaken ? "taken" : "available");
            }
        }, 600);
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (emailStatus === "taken") {
            setError("Este email ya está registrado. Intenta iniciar sesión.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const result = await register(displayName, email, password);
            if (result.success) {
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

    const emailHint = () => {
        if (emailStatus === "checking") return <span className="email-hint checking">Verificando disponibilidad...</span>;
        if (emailStatus === "available") return <span className="email-hint available">✔ Email disponible</span>;
        if (emailStatus === "taken") return <span className="email-hint taken">✖ Este email ya está en uso</span>;
        return null;
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
                            onChange={handleEmailChange}
                            placeholder="Ingresa tu email"
                            required
                        />
                        {emailHint()}
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

                    <Button
                        disabled={loading || emailStatus === "taken" || emailStatus === "checking"}
                        type="submit"
                        variant="primary"
                    >
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
