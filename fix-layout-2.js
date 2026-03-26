// @ts-check
const fs = require('fs');

const jsxPath = 'c:/Users/alexa/Documents/segunda copia ecommerce con pruebas unitarias/segunda-copia-ecommerce-con-pruebas-unitarias/copia-ecommerce-con-pruebas-parte-2/frontend/src/components/molecules/ProductCard/ProductCard.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

jsx = jsx.replace('  // Ultra-Premium Square Vertical Layout', '  if (orientation === "square") {\\n    // Ultra-Premium Square Vertical Layout');
jsx = jsx.replace('className="product-card product-card--vertical product-card--square"', 'className="product-card product-card--square"');

const appendJsx = `      </div>
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
              ? description.substring(0, 60) + '...'
              : description}
          </p>
        )}
        {/* Muestra el precio */}
        <div className="product-card-price" data-testid="product-price">\\$\\{price\\}</div>
      </div>
      {/* Acciones: badges y botón de agregar al carrito */}
      <div className="product-card-actions">
        <div className="product-card-badges">
          <Badge text={stockBadge.text} variant={stockBadge.variant} />
          {hasDiscount && (
            <Badge text={\`-\\$\\{product.discount\\}%\`} variant="warning" />
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
}`;

jsx = jsx.replace('    </div>\\r\\n  );\\r\\n}', appendJsx);
jsx = jsx.replace('    </div>\\n  );\\n}', appendJsx);
jsx = jsx.replace('    </div>\\r\\n  );\\n}', appendJsx);
jsx = jsx.replace('    </div>\\n  );\\r\\n}', appendJsx);

fs.writeFileSync(jsxPath, jsx);

const cssPath = 'c:/Users/alexa/Documents/segunda copia ecommerce con pruebas unitarias/segunda-copia-ecommerce-con-pruebas-unitarias/copia-ecommerce-con-pruebas-parte-2/frontend/src/components/molecules/ProductCard/ProductCard.css';
let css = fs.readFileSync(cssPath, 'utf8');

const oldCss = `.product-card {
  background: var(--surface);
  border: 1px solid rgba(201, 160, 99, 0.15); /* Light wood matching tint */
  border-radius: 16px; /* More rounded premium feel */
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* Softer, broader shadow */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  box-sizing: border-box;
  min-width: 260px;
  max-width: 320px;
  min-height: 260px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Efecto hover en la tarjeta */
.product-card:hover {
  box-shadow: 0 12px 28px rgba(201, 160, 99, 0.15); /* Golden hover glow */
  transform: translateY(-6px);
  border-color: rgba(201, 160, 99, 0.4);
}`;

const newCss = `.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--gap-sm, 12px);
  box-shadow: var(--elev-1);
  transition: all 0.22s ease;
  overflow: hidden;
  box-sizing: border-box;
  min-width: 260px;
  max-width: 320px;
  min-height: 260px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Efecto hover en la tarjeta */
.product-card:hover {
  box-shadow: var(--elev-2);
  transform: translateY(-2px);
  border-color: var(--border);
}`;

css = css.replace(oldCss, newCss);
css = css.replace(oldCss.replace(/\\n/g, '\\r\\n'), newCss);

fs.writeFileSync(cssPath, css);
console.log("Done");
