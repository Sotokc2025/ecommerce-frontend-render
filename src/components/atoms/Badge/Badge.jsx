// @ts-check
// Importa React para crear el componente.
import React from "react";
// Importa los estilos CSS del badge.
import "./Badge.css";

// Componente funcional que muestra una etiqueta (badge) con estilos y variantes.
export default function Badge({ text, variant = "info", className = "" }) {
  // Construye la clase CSS combinando la base, la variante y clases extra.
  const badgeClasses = ["badge", `badge-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  // Renderiza el badge con el texto y las clases correspondientes.
  return <span className={badgeClasses}>{text}</span>;
}
