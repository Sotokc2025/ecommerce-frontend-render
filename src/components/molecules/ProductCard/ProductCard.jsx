// Importa Link para navegación interna.
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Importa el contexto del carrito para agregar productos.
import { useCart } from "../../../context/CartContext";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import * as wishListService from "../../../services/wishListService";
// Importa el componente Badge para mostrar estado de stock y descuentos.
import Badge from "../../atoms/Badge";
// Importa el componente Button para acciones.
import Button from "../../atoms/Button";
import StarRating from "../../atoms/StarRating/StarRating";
import Icon from "../../atoms/Icon/Icon";
// Importa los estilos CSS del card de producto.
import "./ProductCard.css";

// Componente funcional que muestra la tarjeta de un producto.
export default function ProductCard({ product, orientation = "vertical" }) {
  const [notification, setNotification] = useState(null);
  const [isInWishList, setIsInWishList] = useState(false);
  const navigate = useNavigate();
  // Función para mostrar el detalle del producto en consola
  // Función para navegar a la página de detalle del producto
  function irADetalle() {
    navigate(`/product/${product.id || product._id}`);
  }
  // Obtiene la función para agregar al carrito desde el contexto.
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  // Extrae propiedades del producto.
  const { name, price, stock, imagesUrl, description } = product || {};

  // Wishlist: comprobar si el producto está en la wishlist del usuario autenticado
  useEffect(() => {
    let mounted = true;
    const prodId = product?.id || product?._id;
    if (!prodId || !isAuthenticated) {
      setIsInWishList(false);
      return;
    }

    const check = async () => {
      try {
        const res = await wishListService.checkProductInWishList(prodId);
        if (!mounted) return;
        setIsInWishList(!!res.inWishList);
      } catch (err) {
        console.warn("check wishlist failed", err);
        if (mounted) setIsInWishList(false);
      }
    };

    check();
    return () => {
      mounted = false;
    };
  }, [product, isAuthenticated]);

  // Si no hay producto, muestra mensaje de no disponible.
  if (!product) {
    return (
      <div
        className="product-card product-card--empty"
      >
        <p className="muted">Producto no disponible</p>
      </div>
    );
  }

  // Define el badge de stock según disponibilidad.
  const stockBadge =
    stock > 0
      ? { text: "Disponible en madera", variant: "success" }
      : { text: "Sin existencias de madera", variant: "error" };
  // Verifica si el producto tiene descuento.
  const hasDiscount = product.discount && product.discount > 0;
  // Función para agregar el producto al carrito.
  const handleAddToCart = () => {
    addToCart(product, 1);
    setNotification("Producto agregado al carrito");
    setTimeout(() => setNotification(null), 2500);
  };


  // Función para alternar wishlist
  const handleToggleWish = async () => {
    try {
      const prodId = product.id || product._id;
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (isInWishList) {
        await wishListService.removeFromWishList(prodId);
        setIsInWishList(false);
      } else {
        await wishListService.addToWishList(prodId);
        setIsInWishList(true);
      }
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };
  // Ruta para ver el detalle del producto.
  const productLink = `/product/${product.id || product._id}`;
  // Clase CSS según orientación (vertical/horizontal).
  const cardClass = `product-card product-card--${orientation}`;

  if (orientation === "horizontal") {
    return (
      <div className="product-card product-card--horizontal">
        {notification && (
          <div className="product-notification">
            {notification}
          </div>
        )}
        <Link to={productLink} className="product-card-image-link">
          <img
            src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
            alt={name}
            className="product-card-image"
            loading="lazy"
            onError={(event) => {
              event.target.src = "/img/products/placeholder.svg";
            }}
          />
        </Link>
        <div className="product-card-content">
          <h3 className="product-card-title">
            <Link to={productLink} className="product-card-title-link">{name}</Link>
          </h3>
          <StarRating rating={4.5} count={128} size={14} />
          {description && (
            <p className="product-card-description">
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </p>
          )}
          <div className="product-card-price" data-testid="product-price">${price}</div>
        </div>
        <div className="product-card-actions">
          <div className="product-card-badges">
            <Badge text={stockBadge.text} variant={stockBadge.variant} />
            {hasDiscount && <Badge text={`-${product.discount}%`} variant="warning" />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: '8px' }}>
            <Button variant="primary" size="sm" disabled={stock === 0} onClick={handleAddToCart} style={{ width: '100%' }}>
              Añadir al carrito
            </Button>
            <Button variant={isInWishList ? 'secondary' : 'outline'} size="sm" onClick={handleToggleWish} style={{ width: '100%' }}>
              {isInWishList ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icon name="heartFilled" size={16} /> Favoritos</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icon name="heart" size={16} /> Añadir a favoritos</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orientation === "square") {
    // Ultra-Premium Square Layout
    return (
      <div className="product-card product-card--square">
        {notification && (
          <div className="product-notification">
            {notification}
          </div>
        )}
        
        <Link to={productLink} className="product-card-image-link">
          <img
            src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
            alt={name}
            className="product-card-image"
            loading="lazy"
            onError={(event) => {
              event.target.src = "/img/products/placeholder.svg";
            }}
          />
        </Link>
        
        <div className="product-card-overlay-bg"></div>

        <div className="product-card-badges-top">
          {hasDiscount && <div className="premium-badge discount">-{product.discount}%</div>}
          {stock === 0 && <div className="premium-badge out-stock">Agotado</div>}
          {stock > 0 && !hasDiscount && <div className="premium-badge instock">Disponible</div>}
        </div>

        <div className="hover-actions">
          <button 
            className="floating-circle-btn" 
            onClick={(e) => { e.preventDefault(); handleToggleWish(); }}
            title={isInWishList ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Icon name={isInWishList ? "heartFilled" : "heart"} size={20} color={isInWishList ? "#dc3545" : "inherit"} />
          </button>
          <button 
            className="floating-circle-btn" 
            disabled={stock === 0}
            onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
            title="Añadir al carrito"
          >
            <span style={{fontWeight: 900, fontSize: '24px', lineHeight: '1'}}>{stock === 0 ? '-' : '+'}</span>
          </button>
        </div>

        <div className="product-card-square-info">
          <h3 className="product-card-title">
            <Link to={productLink} className="product-card-title-link">{name}</Link>
          </h3>
          <StarRating rating={4.5} count={128} size={14} />
          <div className="product-card-price" data-testid="product-price">${price}</div>
        </div>
      </div>
    );
  }

  // STANDARD VERTICAL LAYOUT (Default grid)
  return (
    <div className={cardClass}>
      {/* Imagen del producto con enlace al detalle */}
      {notification && (
        <div className="product-notification">
          {notification}
        </div>
      )}
      <Link to={productLink} className="product-card-image-link">
        <img
          src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
          alt={name}
          className="product-card-image"
          onError={(event) => {
            event.target.src = "/img/products/placeholder.svg";
          }}
        />
      </Link>
      {/* Botón para navegar a detalle */}
      <button className="product-card-detail-btn" onClick={irADetalle}>
        Detalle del producto
      </button>
      {/* Contenido textual del producto */}
      <div className="product-card-content">
        <h3 className="product-card-title">
          <Link
            to={productLink}
            className="product-card-title-link"
          >
            {name}
          </Link>
        </h3>
        <StarRating rating={4.5} count={128} size={14} />
        {/* Muestra la descripción si existe, recortada a 60 caracteres */}
        {description && (
          <p
            className="product-card-description"
          >
            {description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </p>
        )}
        {/* Muestra el precio */}
        <div className="product-card-price" data-testid="product-price">${price}</div>
      </div>
      {/* Acciones: badges y botón de agregar al carrito */}
      <div className="product-card-actions">
        <div className="product-card-badges">
          <Badge text={stockBadge.text} variant={stockBadge.variant} />
          {hasDiscount && (
            <Badge text={`-${product.discount}%`} variant="warning" />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: '8px' }}>
          <Button
            variant="primary"
            size="sm"
            disabled={stock === 0}
            onClick={handleAddToCart}
            data-testid="add-to-cart-btn"
            style={{ width: '100%' }}
          >
            Añadir al carrito
          </Button>
          <Button
            variant={isInWishList ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleToggleWish}
            data-testid="wish-toggle-btn"
            style={{ width: '100%' }}
          >
            {isInWishList ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icon name="heartFilled" size={16} /> Favoritos</span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icon name="heart" size={16} /> Añadir a favoritos</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
