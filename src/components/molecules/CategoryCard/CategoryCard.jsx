// @ts-check
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

/**
 * Tarjeta de Categoría con Diseño Premium (Fase 5)
 * @param {Object} props
 * @param {string} props.id - ObjectId de la categoría
 * @param {string} props.name - Nombre de la categoría
 * @param {string} [props.description] - Descripción opcional
 * @param {string} [props.imageURL] - URL del activo (brain-generated)
 */
export default function CategoryCard({ id, name, description, imageURL }) {
  const navigate = useNavigate();
  
  // URL por defecto si no hay imagen (aunque ahora tenemos premium)
  const displayImage = imageURL || "https://placehold.co/800x600.png";

  const handleClick = () => {
    // Redirige a la página de la categoría (con filtros aplicados)
    navigate(`/category/${id}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <img src={displayImage} alt={name} loading="lazy" />
      <div className="category-card-overlay">
        <h3 className="category-card-title">{name}</h3>
        {description && <p className="category-card-desc">{description}</p>}
      </div>
    </div>
  );
}
