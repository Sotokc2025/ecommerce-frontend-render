// @ts-check
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../atoms/Button";
import ErrorMessage from "../../atoms/ErrorMessage/ErrorMessage";
import { createReview } from "../../../services/reviewService";

export default function ReviewForm({ productId, onCreated }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthenticated) {
    return <p className="muted">Inicia sesión para escribir una reseña.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!productId) return setError("Producto inválido");
    if (!comment.trim()) return setError("El comentario no puede estar vacío");
    
    setIsSubmitting(true);
    try {
      await createReview({ product: productId, rating: Number(rating), comment: comment.trim() });
      setComment("");
      setRating(5);
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
      setError(serverMessage || "Error creando la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <label>
        Puntuación:
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={5}>5 - Excelente</option>
          <option value={4}>4 - Muy bueno</option>
          <option value={3}>3 - Bueno</option>
          <option value={2}>2 - Regular</option>
          <option value={1}>1 - Malo</option>
        </select>
      </label>
      <label>
        Comentario:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu opinión"
          rows={3}
        />
      </label>
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar reseña"}
      </Button>
    </form>
  );
}
