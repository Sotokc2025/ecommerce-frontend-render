
// Importa hooks y componentes necesarios para la página principal.
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BannerCarousel from "../components/organisms/BannerCarousel";
import "./Home.css";
import List from "../components/organisms/List/List";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import Loading from "../components/atoms/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { fetchProducts, fetchBestSellers } from "../services/productService";

// TODO: Agregar paginación o scroll infinito si la lista de productos crece mucho.
// TODO: Mejorar accesibilidad (etiquetas ARIA, roles, etc.) en los componentes visuales.
// TODO: Mostrar filtros de productos por categoría, precio, etc. para mejorar la experiencia de usuario.
// TODO: Agregar pruebas unitarias para el manejo de errores y estados vacíos.

// Componente principal Home
export default function Home() {
  // Estado para productos, carga y error.
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect para cargar productos al montar el componente.
  useEffect(() => {
    // Función asíncrona para obtener productos.
    const loadProducts = async () => {
      try {
        setLoading(true); // Activa el estado de carga.
        setError(null);   // Limpia errores previos.
        
        const [productsData, bestSellersData] = await Promise.all([
          fetchProducts(),
          fetchBestSellers()
        ]);
        
        setProducts(productsData); // Actualiza el estado con los productos.
        setBestSellers(bestSellersData); // Actualiza con los más vendidos.
      } catch (err) {
        setError("No se pudieron cargar los productos de madera. Intenta más tarde."); // Maneja error.
        setProducts([]); // Limpia productos si falla.
        setBestSellers([]);
      } finally {
        setLoading(false); // Finaliza el estado de carga.
      }
    };

    loadProducts(); // Ejecuta la carga de productos.
  }, []);

  // Renderiza el banner y la lista de productos o mensajes de estado.
  return (
    <div>
      <Helmet>
        <title>Inicio | Maderas y Triplay TyMCO</title>
        <meta name="description" content="Encuentra la mejor calidad en maderas, triplay y materiales de construcción en Maderas TyMCO." />
        <meta name="keywords" content="Maderas, Triplay, MDF, Construcción, Carpintería" />
      </Helmet>
      {/* Carrusel de banners */}
      <BannerCarousel banners={homeImages} />
      {/* Muestra loading, error o lista de productos según el estado */}
      {loading ? (
        <Loading>Cargando productos...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : products.length > 0 ? (
        <>
          {bestSellers.length > 0 && (
            <div className="best-sellers-section" style={{ padding: "40px 0 20px 0" }}>
              <List
                title="🔥 Los más vendidos"
                products={bestSellers}
                layout="row"
              />
            </div>
          )}
          <List
            title="Maderas y Triplay recomendados"
            products={products}
            layout="grid"
          />
        </>
      ) : (
        <ErrorMessage>No hay productos de madera en el catálogo</ErrorMessage>
      )}
    </div>
  );
}
