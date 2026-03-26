// @ts-check
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
/**
 * @param {object} props
 * @param {any} props.product
 * @param {string} [props.orientation]
 * @param {string} [props.className]
 */
export default function ProductCard({ product, orientation = "vertical", className = "" }) {
  const [notification, setNotification] = useState(/** @type {string|null} */ (null));
  const [isInWishList, setIsInWishList] = useState(false);
  const navigate = useNavigate();

  /** @param {any} event */
  const handleImageError = (event) => {
    event.target.src = "/img/products/placeholder.svg";
  };

  function irADetalle() {
    navigate(`/product/${product.id || product._id}`);
  }

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { name, price, stock, imagesUrl, description } = product || {};

  useEffect(() => {
    let mounted = true;
    const prodId = product?.id || product?._id;
    if (!prodId || !isAuthenticated) {
      setIsInWishList(false);
      return;
    }

    const check = async () => {
      try {
        const isHearted = await wishListService.checkProductInWishList(prodId);
        if (!mounted) return;
        setIsInWishList(!!isHearted);
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

  if (!product) {
    return (
      <div className={`product-card product-card--empty ${className}`}>
        <p className="muted">Producto no disponible</p>
      </div>
    );
  }

  const stockBadge =
    stock > 0
      ? { text: "Disponible en madera", variant: "success" }
      : { text: "Sin existencias de madera", variant: "error" };
  const hasDiscount = product.discount && product.discount > 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
    setNotification("Producto agregado al carrito");
    setTimeout(() => setNotification(null), 2500);
  };

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

  const productLink = `/product/${product.id || product._id}`;
  const cardClass = `product-card product-card--${orientation} ${className}`;

  if (orientation === "horizontal") {
    return (
      <div className={cardClass}>
        {notification && <div className="product-notification">{notification}</div>}
        <Link to={productLink} className="product-card-image-link">
          <img
            src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
            alt={name}
            className="product-card-image"
            loading="lazy"
            onError={handleImageError}
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
          <div className="product-card-price">${price}</div>
        </div>
        <div className="product-card-actions">
          <div className="product-card-badges">
            <Badge text={stockBadge.text} variant={/** @type {any} */ (stockBadge.variant)} />
            {hasDiscount && <Badge text={`-${product.discount}%`} variant="warning" />}
          </div>
          <div className="product-card-buttons-stack">
            <Button variant="primary" size="sm" disabled={stock === 0} onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
            <Button variant={isInWishList ? 'secondary' : 'outline'} size="sm" onClick={handleToggleWish}>
              {isInWishList ? (
                <span className="btn-icon-label"><Icon name="heartFilled" size={16} /> Favoritos</span>
              ) : (
                <span className="btn-icon-label"><Icon name="heart" size={16} /> Añadir a favoritos</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orientation === "square") {
    return (
      <div className={cardClass}>
        {notification && <div className="product-notification">{notification}</div>}
        <Link to={productLink} className="product-card-image-link">
          <img
            src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
            alt={name}
            className="product-card-image"
            loading="lazy"
            onError={handleImageError}
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
            <Icon name={/** @type {any} */ (isInWishList ? "heartFilled" : "heart")} size={20} />
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
          <div className="product-card-price">${price}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      {notification && <div className="product-notification">{notification}</div>}
      <Link to={productLink} className="product-card-image-link">
        <img
          src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
          alt={name}
          className="product-card-image"
          onError={handleImageError}
        />
      </Link>
      <button className="product-card-detail-btn" onClick={irADetalle}>
        Detalle del producto
      </button>
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
        <div className="product-card-price">${price}</div>
      </div>
      <div className="product-card-actions">
        <div className="product-card-badges">
          <Badge text={stockBadge.text} variant={/** @type {any} */ (stockBadge.variant)} />
          {hasDiscount && (
            <Badge text={`-${product.discount}%`} variant="warning" />
          )}
        </div>
        <div className="product-card-buttons-stack">
          <Button variant="primary" size="sm" disabled={stock === 0} onClick={handleAddToCart}>
            Añadir al carrito
          </Button>
          <Button variant={isInWishList ? 'secondary' : 'outline'} size="sm" onClick={handleToggleWish}>
            {isInWishList ? (
              <span className="btn-icon-label"><Icon name="heartFilled" size={16} /> Favoritos</span>
            ) : (
              <span className="btn-icon-label"><Icon name="heart" size={16} /> Añadir a favoritos</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}