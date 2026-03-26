// @ts-check
// Importa hooks y componentes necesarios para la página principal.
// @ts-ignore
import { Helmet as HelmetComponent } from "react-helmet-async";
import BannerCarousel from "../components/organisms/BannerCarousel";
import "./Home.css";
import List from "../components/organisms/List/List";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import ProductCardSkeleton from "../components/molecules/ProductCard/ProductCardSkeleton";
import homeImages from "../data/homeImages.json";
import { useHomeProducts, useHomeCategories } from "../hooks/useProducts"; // Hook soberano de datos.
import CategoryCard from "../components/molecules/CategoryCard/CategoryCard";

/** @type {any} */
const Helmet = HelmetComponent;

// Componente principal Home
export default function Home() {
  // Lógica delegada al hook para mayor claridad y mantenimiento.
  // @ts-ignore
  const { products, bestSellers, loading: productsLoading, error: productsError } = useHomeProducts();
  const { categories, loading: catsLoading } = useHomeCategories();

  const loading = productsLoading || catsLoading;
  const error = productsError;

  // Renderiza el banner y la lista de productos o mensajes de estado.
  return (
    <div>
      <Helmet>
        <title>Inicio | Maderas y Triplay TyMCO</title>
        <meta name="description" content="Encuentra la mejor calidad en maderas, triplay y materiales de construcción en Maderas TyMCO." />
        <meta name="keywords" content="Maderas, Triplay, MDF, Construcción, Carpintería" />
      </Helmet>
      
      {/* Carrusel de banners */}
      <BannerCarousel banners={/** @type {any} */ (homeImages)} />
      
      {/* Grid de Categorías */}
      {!loading && !error && categories.length > 0 && (
        <section className="categories-grid-section" style={{ padding: "40px 20px" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "1.8rem", fontWeight: "700" }}>Nuestras Líneas de Productos</h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "24px" 
          }}>
            {categories.map((cat) => (
              <CategoryCard 
                key={cat._id}
                id={cat._id} 
                name={cat.name} 
                description={cat.description} 
                imageURL={cat.imageURL} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Muestra loading, error o lista de productos según el estado */}
      {loading ? (
        <div style={{ padding: "0 20px" }}>
          <List loading={true} skeletonCount={8} title="Cargando maderas..." />
        </div>
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