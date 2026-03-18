
// Importa el hook useParams para obtener el parámetro de la URL y el componente de detalle.
import { useParams } from "react-router-dom";
import ProductDetailsCard from "../components/molecules/ProductDetails/ProductDetailsCard";

// TODO: Agregar manejo de errores para productos no encontrados (404).
// TODO: Mostrar productos relacionados en la vista de detalle.
// TODO: Mejorar la visualización de imágenes (galería, zoom, etc.).
// TODO: Agregar pruebas unitarias para la validación de IDs y renderizado condicional.

// Componente principal ProductDetails
export default function ProductDetails() {
  // Obtiene el parámetro productId de la URL.
  const { productId } = useParams();
  // Valida que el ID tenga el formato correcto (MongoDB ObjectId).
  const isValidId = /^[a-f\d]{24}$/i.test(productId);
  if (!isValidId) {
    // Si el ID no es válido, muestra mensaje estructurado.
    return (
      <div className="product-details-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Enlace Roto o Producto Inválido</h2>
        <p className="muted" style={{ margin: '16px 0' }}>
          Lo sentimos, estás buscando un producto que no existe o el enlace está dañado.
        </p>
        <button onClick={() => window.location.href = '/'} className="btn btn-primary">
          Regresar a la tienda
        </button>
      </div>
    );
  }
  // Renderiza el componente de detalle del producto.
  return <ProductDetailsCard productId={productId} />;
}
