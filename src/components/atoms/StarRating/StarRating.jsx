import React from "react";
import Icon from "../Icon/Icon";
import "./StarRating.css";

const StarRating = ({ rating, max = 5, size = 16, count }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="star-rating">
            <div className="stars">
                {[...Array(fullStars)].map((_, i) => (
                    <Icon key={`full-${i}`} name="star" size={size} className="star-full" />
                ))}
                {hasHalfStar && <Icon name="starHalf" size={size} className="star-half" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Icon key={`empty-${i}`} name="star" size={size} className="star-empty" />
                ))}
            </div>
            {count !== undefined && (
                <span className="rating-count">({count})</span>
            )}
        </div>
    );
};

export default StarRating;
