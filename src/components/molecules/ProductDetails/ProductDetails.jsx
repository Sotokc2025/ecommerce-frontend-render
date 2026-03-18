// Importa hooks y componentes necesarios para mostrar el detalle de producto.
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { fetchCategories } from "../../../services/categoryService";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { getProductById } from "../../../services/productService";
import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import StarRating from "../../atoms/StarRating/StarRating";
import Icon from "../../atoms/Icon/Icon";
import { useAuth } from "../../../context/AuthContext";
import ReviewList from "../ReviewList/ReviewList";
import ReviewForm from "../../organisms/ReviewForm/ReviewForm";
import * as wishListService from "../../../services/wishListService";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import "./ProductDetails.css";

// Componente funcional para mostrar el detalle de un producto.
export default function ProductDetails({ productId }) {
  // Obtiene la función para agregar al carrito desde el contexto.
  const { addToCart } = useCart();
  // Estado para el producto actual.
  const [product, setProduct] = useState(null);
  // Estado para todas las categorías (para resolución de breadcrumbs)
  const [allCategories, setAllCategories] = useState([]);
  // Estado para mostrar spinner de carga.
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error.
  const [error, setError] = useState(null);
  const [isInWishList, setIsInWishList] = useState(false);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Efecto para cargar el producto y las categorías al montar o cambiar el id.
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar producto y categorías en paralelo
        const [foundProduct, categoriesList] = await Promise.all([
          getProductById(productId),
          fetchCategories()
        ]);

        setAllCategories(categoriesList);

        if (!foundProduct) {
          setError("Producto no encontrado");
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Ocurrió un error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Resuelve la categoría del producto usando los datos reales.
  const resolvedCategory = useMemo(() => {
    const categoryId = product?.category?._id || product?.category;
    if (!categoryId) return null;

    return (
      allCategories.find((cat) => (cat._id === categoryId || cat.id === categoryId)) ||
      null
    );
  }, [product, allCategories]);
  // Obtiene el slug de la categoría para la ruta.
  const categorySlug = resolvedCategory?._id || product?.category?.name || null;

  // Función para agregar el producto al carrito.
  const handleAddToCart = () => {
    if (product) addToCart(product, 1);
  };

  // Wishlist: alternar estado
  const handleToggleWish = async () => {
    const pid = product?.id || product?._id;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isInWishList) {
        await wishListService.removeFromWishList(pid);
        setIsInWishList(false);
      } else {
        await wishListService.addToWishList(pid);
        setIsInWishList(true);
      }
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  // Comprobar estado wishlist cuando cargue el producto o cambie auth
  useEffect(() => {
    let mounted = true;
    const pid = product?.id || product?._id;
    if (!pid || !isAuthenticated) {
      setIsInWishList(false);
      return;
    }

    const check = async () => {
      try {
        const res = await wishListService.checkProductInWishList(pid);
        if (!mounted) return;
        setIsInWishList(!!res.inWishList);
      } catch (err) {
        console.warn('check wishlist failed', err);
        if (mounted) setIsInWishList(false);
      }
    };

    check();
    return () => { mounted = false; };
  }, [product, isAuthenticated]);

  // Si está cargando, muestra el spinner.
  if (loading) {
    return (
      <div className="product-details-container">
        <ProductDetailsSkeleton />
      </div>
    );
  }
  // Si hay error, muestra el mensaje de error y sugerencias.
  if (error) {
    return (
      <div className="product-details-container">
        <ErrorMessage message={error}>
          <p className="muted">
            Revisa nuestra <Link to="/">página principal</Link> o explora otras
            categorías.
          </p>
        </ErrorMessage>
      </div>
    );
  }
  // Si no hay producto, no muestra nada.
  if (!product) return null;

  // Extrae propiedades del producto.
  const { name, description, price, stock, imagesUrl, category } = product;
  // Define el badge y label de stock.
  const stockBadge = stock > 0 ? "success" : "error";
  const stockLabel = stock > 0 ? "En stock" : "Agotado";

  // Renderiza el detalle del producto.
  return (
    <div className="product-details-container">
      {/* Migas de pan para navegación */}
      <Breadcrumb
        items={[
          { label: "Inicio", to: "/" },
          categorySlug
            ? {
              label: resolvedCategory?.name || category?.name || "Categoría",
              to: `/category/${categorySlug}`,
            }
            : { label: "Categoría" },
          { label: name },
        ]}
      />
      <div className="product-details-main">
        {/* Imagen principal del producto */}
        <div className="product-details-image">
          <img
            src={imagesUrl?.[0] || "/img/products/placeholder.svg"}
            alt={name}
            onError={(event) => {
              event.target.src = "/img/products/placeholder.svg";
            }}
          />
        </div>
        {/* Información textual y acciones */}
        <div className="product-details-info">
          <div className="product-details-title">
            <h1 className="h1">{name}</h1>
            {(resolvedCategory?.name || category?.name) && (
              <span className="product-details-category">
                {resolvedCategory?.name || category?.name}
              </span>
            )}
            <StarRating rating={4.5} count={128} size={18} />
          </div>
          {/* Descripción del producto */}
          <p className="product-details-description">{description}</p>
          {/* Estado de stock y cantidad disponible */}
          <div className="product-details-stock">
            <Badge text={stockLabel} variant={stockBadge} />
            {stock > 0 && (
              <span className="muted">{stock} unidades disponibles</span>
            )}
          </div>
          {/* Precio del producto */}
          <div className="product-details-price">${price}</div>
          {/* Acciones: agregar al carrito y ver carrito */}
          <div className="product-details-actions">
            <Button
              variant="primary"
              size="lg"
              disabled={stock === 0}
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </Button>
            <Link to="/cart" className="btn btn-outline btn-lg">
              Ver carrito
            </Link>
            <Button
              variant={isInWishList ? 'secondary' : 'outline'}
              size="lg"
              onClick={handleToggleWish}
            >
              {isInWishList ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="heartFilled" size={18} /> En favoritos</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="heart" size={18} /> Añadir a favoritos</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Reseñas */}
      <div className="product-reviews">
        <h2>Reseñas</h2>
        <ReviewList productId={product._id || product.id} refreshKey={reviewsRefreshKey} />
        {isAuthenticated && (
          <div style={{ marginTop: 12 }}>
            <ReviewForm productId={product._id || product.id} onCreated={() => setReviewsRefreshKey(k => k + 1)} />
          </div>
        )}
      </div>
    </div>
  );
}
