// @ts-check
import React from "react";
import Skeleton from "../../atoms/Skeleton/Skeleton";
import "./ProductCardSkeleton.css";

/**
 * Skeleton para la tarjeta de producto.
 * Mantiene el layout para evitar saltos visuales durante la carga.
 * 🛡️🦴✨
 */
const ProductCardSkeleton = ({ orientation = "vertical" }) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={`product-card-skeleton product-card-skeleton--${orientation}`}>
      <div className="product-card-skeleton__image">
        <Skeleton variant="rect" height={isHorizontal ? "100%" : "200px"} />
      </div>
      
      <div className="product-card-skeleton__content">
        <Skeleton variant="text" width="40%" className="category-skeleton" />
        <Skeleton variant="text" width="85%" height="24px" className="title-skeleton" />
        
        <div className="product-card-skeleton__footer">
          <Skeleton variant="text" width="30%" height="28px" />
          <Skeleton variant="rect" width="100px" height="36px" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;