// @ts-check

// Importa el hook useParams para obtener el parámetro de la URL
import { useParams } from "react-router-dom";
// Importa el componente ProductDetails que muestra la información del producto
import ProductDetails from "../components/molecules/ProductDetails/ProductDetails";

// Componente Product, obtiene el productId de la URL y lo pasa a ProductDetails
export default function Product() {
  // Obtiene el parámetro productId de la URL
  const { productId } = useParams();

  // Renderiza el componente ProductDetails y le pasa el productId como prop
  return <ProductDetails productId={productId} />;
}
