// Importa React para crear el componente.
import React from "react";
// Importa los estilos CSS del botón.
import "./Button.css";

// Componente funcional que muestra un botón reutilizable con variantes y tamaños.
export default function Button({
  children, // Contenido del botón (texto o íconos).
  onClick, // Función que se ejecuta al hacer clic.
  type = "button", // Tipo de botón (button, submit, etc).
  disabled = false, // Si el botón está deshabilitado.
  variant = "primary", // Variante de estilo (primary, secondary, etc).
  size = "base", // Tamaño del botón (base, sm, lg).
  className = "", // Clases adicionales.
}) {
  // Construye la clase CSS combinando base, variante, tamaño y clases extra.
  const buttonClasses = [
    "btn",
    `btn-${variant}`,
    size !== "base" ? `btn-${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Renderiza el botón con las propiedades y clases correspondientes.
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
