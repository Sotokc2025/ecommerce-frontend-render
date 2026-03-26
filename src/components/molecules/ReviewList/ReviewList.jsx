// @ts-check
import { useEffect, useState } from "react";
import StarRating from "../../atoms/StarRating/StarRating";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import { getProductReviews } from "../../../services/reviewService";

export default function ReviewList({ productId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    getProductReviews(productId)
      .then((r) => {
        if (!mounted) return;
        setReviews(r || []);
      })
      .catch((err) => {
        console.error("Error cargando reviews:", err);
        if (!mounted) return;
        setError(err.message || "Error al cargar reseñas");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [productId, refreshKey]);

  if (loading) return <p>Cargando reseñas...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!reviews || reviews.length === 0)
    return <p className="muted">Sé el primero en dejar una reseña.</p>;

  return (
    <div className="review-list">
      {reviews.map((rev) => (
        <div key={rev._id} className="review-item">
          <div className="review-header">
            <strong>{rev.user?.displayName || 'Usuario'}</strong>
            <StarRating rating={rev.rating} size={14} />
          </div>
          {rev.comment && <p className="review-comment">{rev.comment}</p>}
        </div>
      ))}
    </div>
  );
}
