# E-commerce de Maderas

Proyecto realizado en React para la venta y gestión de productos de madera. Incluye funcionalidades de catálogo, carrito, checkout y confirmación de compra.

## Características principales
- Catálogo dinámico de productos de madera (más de 10 productos)
- Vista de detalle de producto
- Carrito de compras con persistencia en localStorage
- Checkout con formulario de datos y confirmación de compra
- Navegación clara entre páginas
- Manejo de estados vacíos y validaciones
- Diseño responsivo y amigable

## Instalación y ejecución
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm start
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto
- `src/components/` - Componentes reutilizables (Carrito, Producto, Navbar, etc.)
- `src/pages/` - Páginas principales (Home, ProductDetails, Cart, Checkout, OrderConfirmation)
- `src/context/` - Contextos globales (Carrito, Tema)
- `src/services/` - Servicios para manejo de datos
- `src/data/` - Datos mockeados en formato JSON

## Endpoints simulados (servicios)
> Los datos se obtienen de archivos JSON y funciones asíncronas en `src/services/`.

- **fetchProducts**: Obtiene todos los productos
- **getProductById**: Obtiene un producto por ID
- **fetchCategories**: Obtiene todas las categorías
- **getCategoryById**: Obtiene una categoría por ID
- **getProductsByCategory**: Obtiene productos de una categoría
- **getPaymentMethods**: Obtiene métodos de pago
- **getDefaultPaymentMethod**: Obtiene el método de pago por defecto
- **getShippingAddresses**: Obtiene direcciones de envío

## Rutas de navegación
La app utiliza React Router para la navegación entre páginas:

- `/` : Página de inicio (catálogo de productos)
- `/product/:productId` : Detalle de producto
- `/cart` : Carrito de compras
- `/checkout` : Checkout y formulario de compra
- `/order-confirmation` : Confirmación de compra
- `/login` : (opcional) Login de usuario
- `/profile` : (opcional) Perfil de usuario

## Ejemplos de navegación

| Ruta                        | Descripción                                 | Ejemplo de navegación |
|-----------------------------|---------------------------------------------|-----------------------|
| `/`                         | Catálogo de productos (inicio)              | Ir al home            |
| `/product/689fea8fea2b45bf914f01dc` | Detalle del producto con ID específico     | Ver detalles de un producto |
| `/cart`                     | Carrito de compras                          | Ir al carrito         |
| `/checkout`                 | Formulario de compra y datos de usuario     | Proceder al checkout  |
| `/order-confirmation`       | Confirmación de compra                      | Ver confirmación      |
| `/login`                    | Login de usuario (opcional)                 | Iniciar sesión        |
| `/profile`                  | Perfil de usuario (opcional)                | Ver perfil            |

### Ejemplo en React Router
```jsx
import { Link } from 'react-router-dom';

// Navegar al detalle de un producto
<Link to="/product/689fea8fea2b45bf914f01dc">Ver producto</Link>

// Navegar al carrito
<Link to="/cart">Ir al carrito</Link>

// Navegar al checkout
<Link to="/checkout">Comprar ahora</Link>
```

### Navegación programática
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Ir al carrito
navigate('/cart');

// Ir al detalle de un producto
navigate(`/product/${productId}`);
```

## Validaciones y feedback
- No se puede avanzar a checkout si el carrito está vacío
- El formulario de checkout valida campos obligatorios
- Mensajes claros en estados vacíos (ejemplo: "Tu carrito está vacío")
- Feedback visual al agregar productos al carrito

## Autor
- [Karla Cristina Soto G.]

## Licencia
Este proyecto está bajo la licencia MIT.
