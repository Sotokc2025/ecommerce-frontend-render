// @ts-check
// Importa el componente ProductCard para mostrar cada producto.
import ProductCard from "../../molecules/ProductCard/ProductCard";
import ProductCardSkeleton from "../../molecules/ProductCard/ProductCardSkeleton";
// Importa los estilos CSS para la lista.
import "./List.css";

/**
 * @param {object} props
 * @param {any[]} [props.products]
 * @param {string} [props.title]
 * @param {string} [props.layout]
 * @param {boolean} [props.loading]
 * @param {number} [props.skeletonCount]
 */
export default function List({
  products = [], // Array de productos a mostrar.
  title = "Nuestros Productos", // Título de la lista.
  layout = "grid", // Tipo de layout: grid, row o vertical.
  loading = false, // Nuevo: Estado de carga.
  skeletonCount = 6, // Nuevo: Cantidad de esqueletos.
}) {
  // Renderiza el contenedor principal de la lista.
  return (
    <div className="list-container">
      {/* Encabezado con el título */}
      <div className="list-header">
        {loading ? (
          <div className="skeleton" style={{ width: "300px", height: "32px", borderRadius: "8px", marginBottom: "20px" }} />
        ) : (
          <h1 className="list-title">{title}</h1>
        )}
      </div>

      {/* Renderiza en grid o vertical según la prop layout */}
      {layout === "grid" ? (
        <div className="list-grid">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <ProductCardSkeleton key={`sk-${i}`} orientation="vertical" />
              ))
            : products.map((product, idx) => (
                <ProductCard
                  key={product._id || product.id || idx}
                  product={product}
                  orientation="vertical"
                  className="list-item"
                />
              ))}
        </div>
      ) : layout === "row" ? (
        <div className="list-row">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={`sk-${i}`} className="list-row-item">
                  <ProductCardSkeleton orientation="vertical" />
                </div>
              ))
            : products.map((product, idx) => (
                <div key={product._id || product.id || idx} className="list-row-item">
                  <ProductCard product={product} orientation="square" />
                </div>
              ))}
        </div>
      ) : (
        <div className="list-vertical">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <ProductCardSkeleton key={`sk-${i}`} orientation="horizontal" />
              ))
            : products.map((product, idx) => (
                <ProductCard
                  key={product._id || product.id || idx}
                  product={product}
                  orientation="horizontal"
                  className="list-item"
                />
              ))}
        </div>
      )}
    </div>
  );
}
