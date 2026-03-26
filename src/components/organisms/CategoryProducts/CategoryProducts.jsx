// @ts-check
// Importa hooks de React para manejar estado y efectos.
import { useState, useMemo } from "react";
// Importa Link para navegación interna.
import { Link } from "react-router-dom";
// Importa el componente Breadcrumb para mostrar la ruta de navegación.
import Breadcrumb from "../../molecules/Breadcrumb/Breadcrumb";
import { useCategoryProducts } from "../../../hooks/useProducts"; // Hook soberano de datos.
// Importa el componente para mostrar cada producto.
import ProductCard from "../../molecules/ProductCard/ProductCard";
import ProductCardSkeleton from "../../molecules/ProductCard/ProductCardSkeleton";
// Importa el componente para mostrar mensajes de error.
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
// Importa los estilos CSS del componente.
import "./CategoryProducts.css";
/**
 * @param {object} props
 * @param {string} props.categoryId
 */
export default function CategoryProducts({ categoryId }) {
  // Estado para el ordenamiento interno de la UI.
  const [sortBy, setSortBy] = useState("featured");
  // Lógica delegada al hook para mayor claridad y desacoplamiento.
  const { category, products, loading, error } = /** @type {any} */ (useCategoryProducts(categoryId));
  // Memoriza los productos ordenados
  const sortedProducts = useMemo(() => {
    const items = /** @type {any[]} */ ([...(products || [])]);
    switch (sortBy) {
      case "price_asc":
        return items.sort((a, b) => a.price - b.price);
      case "price_desc":
        return items.sort((a, b) => b.price - a.price);
      case "name_asc":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return items.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return items;
    }
  }, [products, sortBy]);
  // Si está cargando, muestra esqueletos de carga.
  if (loading) {
    return (
      <div className="category-products-root">
        <div className="category-products-container">
          <div className="category-products-grid">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Si hay error o no existe la categoría, muestra mensaje de error.
  if (error || !category) {
    return (
      <div className="category-products-root">
        <ErrorMessage>
          {error || "Categoría de madera no encontrada"}
          <p className="category-products-muted">
            Vuelve al <Link to="/">inicio</Link> o explora nuestras categorías de madera destacadas.
          </p>
        </ErrorMessage>
      </div>
    );
  }
  // Renderiza la vista de productos de la categoría.
  return (
    <div className="category-products-root">
      {/* Breadcrumb para navegación */}
      <Breadcrumb
        items={/** @type {any} */ ([{ label: "Inicio", to: "/" }, { label: category.name }])}
      />
      <div className="category-products-container">
        <div className="category-products-header">
          <div className="category-products-title">
            <h1 className="category-products-h1">
              {category.parentCategory
                ? `${category.parentCategory.name}: ${category.name}`
                : category.name}
            </h1>
            {/* Muestra la descripción de la categoría si existe */}
            {category.description && (
              <p className="category-products-muted">{category.description}</p>
            )}
          </div>
          <div className="category-products-sort">
            <label htmlFor="sort">Ordenar por:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="name_asc">Nombre: A-Z</option>
              <option value="name_desc">Nombre: Z-A</option>
            </select>
          </div>
        </div>
        {/* Muestra los productos si existen, si no muestra mensaje de error */}
        {sortedProducts.length > 0 ? (
          <div className="category-products-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                orientation="vertical"
              />
            ))}
          </div>
        ) : (
          <ErrorMessage>
            {error || "No se encontraron productos de madera"}
            <p className="category-products-muted">
              No hay productos de madera disponibles en esta categoría por el momento.
            </p>
          </ErrorMessage>
        )}
      </div>
    </div>
  );
}