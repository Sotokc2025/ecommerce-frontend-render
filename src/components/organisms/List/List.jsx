// Importa el componente ProductCard para mostrar cada producto.
import ProductCard from "../../molecules/ProductCard/ProductCard";
// Importa los estilos CSS para la lista.
import "./List.css";

// Componente funcional que muestra una lista de productos en formato grid o vertical.
export default function List({
  products = [], // Array de productos a mostrar.
  title = "Nuestros Productos", // Título de la lista.
  layout = "grid", // Tipo de layout: grid, row o vertical.
}) {
  // Renderiza el contenedor principal de la lista.
  return (
    <div className="list-container">
      {/* Encabezado con el título */}
      <div className="list-header">
        <h1 className="list-title">{title}</h1>
      </div>
      {/* Renderiza en grid o vertical según la prop layout */}
      {layout === "grid" ? (
        <div className="list-grid">
          {/* Mapea los productos y muestra cada uno como ProductCard vertical */}
          {products.map((product, idx) => (
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
          {/* Mapea los productos y muestra cada uno como ProductCard en fila horizontal */}
          {products.map((product, idx) => (
            <div key={product._id || product.id || idx} className="list-row-item">
              <ProductCard
                product={product}
                orientation="square"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-vertical">
          {/* Mapea los productos y muestra cada uno como ProductCard horizontal */}
          {products.map((product, idx) => (
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
};