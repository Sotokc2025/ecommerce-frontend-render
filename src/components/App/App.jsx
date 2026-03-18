// Importa los componentes y páginas principales de la app.
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Para la navegación entre rutas.
import { AuthProvider } from "../../context/AuthContext"; // Proveedor de contexto para autenticación.
import { CartProvider } from "../../context/CartContext"; // Proveedor de contexto para el carrito.
import Layout from "../templates/Layout/Layout"; // Componente de layout general (header, footer, etc).
import Cart from "../../pages/Cart"; // Página del carrito.
import CategoryPage from "../../pages/CategoryPage"; // Página de categorías.
import Checkout from "../../pages/Checkout"; // Página de checkout.
import Home from "../../pages/Home"; // Página principal (catálogo).
import Login from "../../pages/Login"; // Página de login.
import Register from "../../pages/Register"; // Página de registro.
import OrderConfirmation from "../../pages/OrderConfirmation"; // Página de confirmación de compra.
import Orders from "../../pages/Orders"; // Página de órdenes.
import Product from "../../pages/Product"; // Página de detalle de producto.
import Profile from "../../pages/Profile"; // Página de perfil de usuario.
import ProtectedRoute from "../templates/ProtectedRoute/ProtectedRoute"; // Componente para proteger rutas privadas.
import SearchResults from "../../pages/SearchResults"; // Página de resultados de búsqueda.
import Settings from "../../pages/Settings"; // Página de configuración.
import WishList from "../../pages/WishList"; // Página de lista de deseos.

// Componente principal de la aplicación.
function App() {
  return (
    // AuthProvider debe envolver a CartProvider para que el carrito pueda reaccionar a la sesión.
    <AuthProvider>
      <CartProvider>
        {/* BrowserRouter habilita la navegación por rutas en la app. */}
        <BrowserRouter>
          {/* Layout envuelve todas las páginas con la estructura general (header, footer, etc). */}
          <Layout>
            {/* Routes define las rutas disponibles en la aplicación. */}
            <Routes>
              {/* Ruta principal (catálogo de productos) */}
              <Route path="/" element={<Home />} />
              {/* Ruta del carrito */}
              <Route path="/cart" element={<Cart />} />
              {/* Ruta de login */}
              <Route path="/login" element={<Login />} />
              {/* Ruta de registro */}
              <Route path="/register" element={<Register />} />
              {/* Ruta de búsqueda */}
              <Route path="/search" element={<SearchResults />} />
              {/* Ruta de detalle de producto */}
              <Route path="/product/:productId" element={<Product />} />
              {/* Ruta de categoría */}
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              {/* Ruta de perfil protegida, solo para usuarios autenticados */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    redirectTo="/login"
                    allowedRoles={["admin", "customer", "cliente"]}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Ruta de checkout protegida */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout></Checkout>
                  </ProtectedRoute>
                }
              />
              {/* Ruta de wishlist protegida */}
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishList></WishList>
                  </ProtectedRoute>
                }
              />
              {/* Ruta de órdenes protegida */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              {/* Ruta de confirmación de compra */}
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              {/* Ruta de configuración protegida */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings></Settings>
                  </ProtectedRoute>
                }
              />
              {/* Ruta para manejar rutas no encontradas */}
              <Route path="*" element={<div>Ruta no encontrada</div>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

// Exporta el componente principal para ser usado en index.js
export default App;