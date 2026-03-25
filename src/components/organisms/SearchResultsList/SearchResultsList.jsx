
// Importa hooks de React y componentes necesarios para la búsqueda y visualización de productos.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../../services/productService";
import List from "../List/List";
import "./SearchResultsList.css";

// Componente principal para mostrar resultados de búsqueda de productos.
export default function SearchResultsList() {
  // Hook para obtener y modificar los parámetros de búsqueda en la URL.
  const [searchParams] = useSearchParams();
  // Estado para almacenar los productos obtenidos.
  const [products, setProducts] = useState([]);
  // Estado para mostrar spinner de carga.
  const [loading, setLoading] = useState(false);

  // Obtiene el texto de búsqueda desde los parámetros de la URL.
  const query = (searchParams.get("q") || "").trim();

  // Efecto para cargar los productos al montar el componente.
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (isMounted) setProducts(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Estado para el tipo de ordenamiento y dirección.
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filtra y ordena los productos según la búsqueda y el tipo de orden.
  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const normalizedQuery = query.toLowerCase();
    let result = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(normalizedQuery);
      const matchesDescription = product.description
        ?.toLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = product.category?.name
        ?.toLowerCase()
        .includes(normalizedQuery);
      return matchesName || matchesDescription || matchesCategory;
    });
    // Ordena los resultados por nombre o precio.
    result = result.sort((a, b) => {
      let valA = sortBy === "price" ? a.price : a.name.toLowerCase();
      let valB = sortBy === "price" ? b.price : b.name.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [products, query, sortBy, sortOrder]);

  // Determina si hay texto de búsqueda y si no hay resultados.
  const hasQuery = query.length > 0;
  const showNoResults = hasQuery && !loading && filteredProducts.length === 0;



  // Renderiza la interfaz de resultados de búsqueda.
  return (
    <div className="search-results-fullwidth">
      {/* Encabezado con título y descripción */}
      <header className="search-results-header">
        <div>
          <h1 className="search-results-title">
            {hasQuery
              ? `Resultados para "${query}"`
              : "Explora nuestro catálogo"}
          </h1>
          <p className="search-results-description">
            {hasQuery
              ? "Estos son los productos que encontramos basados en tu búsqueda."
              : "Usa la barra de búsqueda para encontrar rápidamente lo que necesitas."}
          </p>
        </div>
        {/* Controles de ordenamiento si hay búsqueda */}
        {hasQuery && (
          <div className="search-results-controls">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
            </select>
            <button
              type="button"
              className="sort-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Ascendente" : "Descendente"}
            </button>
          </div>
        )}
      </header>
      {/* Mensaje de carga */}
      {loading && (
        <div className="search-results-message">
          <h3>Buscando productos...</h3>
          <p>Esto puede tomar unos segundos.</p>
        </div>
      )}
      {/* Mensaje si no hay resultados */}
      {!loading && showNoResults && (
        <div className="search-results-message">
          <h3>No encontramos coincidencias</h3>
          <p>
            Prueba con otros términos o recorre nuestras{" "}
            <Link to="/offers">ofertas destacadas</Link>.
          </p>
        </div>
      )}
      {/* Lista de productos si hay resultados */}
      {!loading && hasQuery && !showNoResults && (
        <List
          products={filteredProducts}
          layout="vertical"
          title={`Resultados para "${query}"`}
        />
      )}
      {/* Mensaje si no hay búsqueda activa */}
      {!loading && !hasQuery && (
        <div className="search-results-message">
          <h3>¿Buscas algo en especial?</h3>
          <p>
            Comienza a escribir en la barra de búsqueda y te mostraremos los
            resultados aquí mismo.
          </p>
        </div>
      )}
    </div>
  );
}
