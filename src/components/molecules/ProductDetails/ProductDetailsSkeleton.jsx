import React from "react";
import Skeleton from "../../atoms/Skeleton/Skeleton";
import "./ProductDetailsSkeleton.css";

const ProductDetailsSkeleton = () => {
    return (
        <div className="product-details-skeleton">
            <div className="skeleton-image-gallery">
                <Skeleton variant="rect" width="100%" height="400px" className="main-image-skeleton" />
                <div className="thumbnail-skeletons">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} variant="rect" width="80px" height="80px" />
                    ))}
                </div>
            </div>
            <div className="skeleton-info-section">
                <Skeleton variant="text" width="90%" height="40px" />
                <Skeleton variant="text" width="30%" height="24px" />
                <div className="skeleton-price-box">
                    <Skeleton variant="text" width="40%" height="36px" />
                    <Skeleton variant="text" width="20%" height="20px" />
                </div>
                <div className="skeleton-description-box">
                    <Skeleton variant="text" width="100%" height="16px" />
                    <Skeleton variant="text" width="100%" height="16px" />
                    <Skeleton variant="text" width="80%" height="16px" />
                </div>
                <div className="skeleton-buy-actions">
                    <Skeleton variant="rect" width="100%" height="48px" />
                    <Skeleton variant="rect" width="100%" height="48px" />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
