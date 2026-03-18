import React from "react";
import Skeleton from "../../atoms/Skeleton/Skeleton";
import "./ProductCardSkeleton.css";

const ProductCardSkeleton = ({ orientation = "vertical" }) => {
    return (
        <div className={`product-card-skeleton product-card-skeleton--${orientation}`}>
            <Skeleton variant="rect" className="skeleton-image" />
            <div className="skeleton-content">
                <Skeleton variant="text" width="80%" height="24px" className="skeleton-title" />
                <Skeleton variant="text" width="60%" height="16px" className="skeleton-description" />
                <Skeleton variant="text" width="40%" height="20px" className="skeleton-price" />
                <div className="skeleton-actions">
                    <Skeleton variant="rect" width="60px" height="28px" className="skeleton-badge" />
                    <Skeleton variant="rect" width="100px" height="36px" className="skeleton-button" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
