// @ts-check
// Importa los estilos CSS para el input.
import "./Input.css";

// Componente funcional que muestra un campo de entrada con etiqueta y estilos.
export default function Input({
  label, // Etiqueta del campo.
  type = "text", // Tipo de input (text, password, etc).
  value, // Valor del input.
  onChange, // Función que se ejecuta al cambiar el valor.
  placeholder = "", // Texto de ayuda.
  disabled = false, // Si el input está deshabilitado.
  className = "", // Clases adicionales.
  id, // ID personalizado.
  ...rest // Otras props adicionales.
}) {
  // Genera un ID único si no se proporciona uno.
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Renderiza el grupo de input con etiqueta y campo.
  return (
    <div className={`input-group ${className}`}>
      {/* Si hay etiqueta, la muestra */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      {/* Campo de entrada con todas las props */}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field"
        {...rest}
      />
    </div>
  );
}
