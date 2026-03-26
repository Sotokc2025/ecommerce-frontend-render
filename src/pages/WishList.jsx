// @ts-check
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import Icon from "../components/atoms/Icon/Icon";
import ErrorMessage from "../components/atoms/ErrorMessage/ErrorMessage";
import * as wishListService from "../services/wishListService";
import { useCart } from "../context/CartContext";
import "./WishList.css";

export default function WishList() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addToCart } = useCart();

	const load = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await wishListService.getUserWishList();
			const products = data?.wishList?.products || [];
			// Filtrar fantasmas (items borrados en BD) y obtener los que sí existen
			const validProducts = products.filter((p) => p && p.product !== null);
			const normalized = validProducts.map((p) => p.product);
			setItems(normalized);
		} catch (err) {
			console.error(err);
			setError(err.message || "Error cargando wishlist");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const handleRemove = async (id) => {
		try {
			await wishListService.removeFromWishList(id);
			setItems((s) => s.filter((p) => (p._id || p.id) !== id));
		} catch (err) {
			console.error(err);
			setError(err.message || "Error al remover producto");
		}
	};

	const handleMoveToCart = async (product) => {
		try {
			const id = product._id || product.id;
			addToCart(product, 1);
			await wishListService.removeFromWishList(id);
			setItems((s) => s.filter((p) => (p._id || p.id) !== id));
		} catch (err) {
			console.error(err);
			setError(err.message || "Error moviendo al carrito");
		}
	};

	if (loading) return <p style={{ padding: 24 }}>Cargando wishlist...</p>;
	if (error) return <ErrorMessage>{error}</ErrorMessage>;

	if (!items || items.length === 0) return <p className="muted" style={{ padding: 24, fontSize: '1.2rem' }}>Tu lista de deseos está vacía.</p>;

	return (
		<div className="wishlist-page">
			<h1>Mi lista de deseos</h1>
			<div className="wishlist-grid">
				{items.map((product) => {
					const id = product._id || product.id;
					const img = (product.imagesUrl && product.imagesUrl[0]) || (product.images && product.images[0]) || "/img/products/placeholder.svg";
					const inStock = product.stock > 0;

					return (
						<div key={id} className="wishlist-item">
							<Link to={`/product/${id}`}>
								<img 
									src={img} 
									alt={product.name} 
									onError={(e) => { e.target.src = "/img/products/placeholder.svg"; }}
								/>
							</Link>
							<div className="wishlist-info">
								<Link to={`/product/${id}`}>
									<h3>{product.name}</h3>
								</Link>
								
								<div className="wishlist-badges">
									{product.category && <span className="badge badge-outline">{product.category}</span>}
									{inStock ? (
										<span className="badge badge-stock">En existencia ({product.stock})</span>
									) : (
										<span className="badge badge-out-of-stock">Agotado</span>
									)}
								</div>

								<div className="wishlist-desc">
									{product.description || "Sin descripción disponible."}
								</div>
								
								<div className="wishlist-price">${parseFloat(product.price).toFixed(2)}</div>
								
								<div className="wishlist-actions">
									<Button 
										variant="primary" 
										size="sm" 
										onClick={() => handleMoveToCart(product)}
										disabled={!inStock}
									>
										Mover al carrito
									</Button>
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => handleRemove(id)} 
										title="Eliminar de lista"
									>
										<Icon name="trash" size={16} />
									</Button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
