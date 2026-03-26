// @ts-check
const fs = require('fs');

const jsxPath = 'c:\\\\Users\\\\alexa\\\\Documents\\\\segunda copia ecommerce con pruebas unitarias\\\\segunda-copia-ecommerce-con-pruebas-unitarias\\\\copia-ecommerce-con-pruebas-parte-2\\\\frontend\\\\src\\\\components\\\\molecules\\\\ProductCard\\\\ProductCard.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const marker = '  // Ultra-Premium Square Vertical Layout';
const parts = jsx.split(marker);
if (parts.length === 2) {
  let newJsx = parts[0] + `  if (orientation === "square") {\n    // Ultra-Premium Square Layout` + parts[1];
  newJsx = newJsx.replace(/    <\\/div>\\r?\\n  \\);\\r?\\n}\\r?\\n?$/, 
`      </div>
    );
  }

  // STANDARD VERTICAL LAYOUT (Default grid)
  return (
    <div className={cardClass}>
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
      <button className="product-card-detail-btn" onClick={irADetalle}>
        Detalle del producto
      </button>
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
        {description && (
          <p
            className="product-card-description"
          >
            {description.length > 60
              ? \`\${description.substring(0, 60)}...\`
              : description}
          </p>
        )}
        <div className="product-card-price" data-testid="product-price">\${price}</div>
      </div>
      <div className="product-card-actions">
        <div className="product-card-badges">
          <Badge text={stockBadge.text} variant={stockBadge.variant} />
          {hasDiscount && (
            <Badge text={\`-\${product.discount}%\`} variant="warning" />
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
`);
  newJsx = newJsx.replace('className="product-card product-card--vertical product-card--square"', 'className="product-card product-card--square"');
  fs.writeFileSync(jsxPath, newJsx);
  console.log('ProductCard.jsx updated');
}

const cssPath = 'c:\\\\Users\\\\alexa\\\\Documents\\\\segunda copia ecommerce con pruebas unitarias\\\\segunda-copia-ecommerce-con-pruebas-unitarias\\\\copia-ecommerce-con-pruebas-parte-2\\\\frontend\\\\src\\\\components\\\\molecules\\\\ProductCard\\\\ProductCard.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/\\.product-card \\{[\\s\\S]*?\\}\\r?\\n\\r?\\n\\/\\* Efecto hover en la tarjeta \\*\\/\\r?\\n\\.product-card:hover \\{[\\s\\S]*?\\}/, 
`.product-card {
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
}`);

fs.writeFileSync(cssPath, css);
console.log('ProductCard.css updated');
