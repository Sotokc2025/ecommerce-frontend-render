// Importa los componentes y páginas principales de la app.
import { lazy, Suspense } from "react"; // Para lazy loading y suspense.
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Para la navegación entre rutas.
import { AuthProvider } from "../../context/AuthContext"; // Proveedor de contexto para autenticación.
import { CartProvider } from "../../context/CartContext"; // Proveedor de contexto para el carrito.
import Layout from "../templates/Layout/Layout"; // Componente de layout general (header, footer, etc).
import Loading from "../atoms/Loading/Loading"; // Componente de carga para fallbacks.
import Home from "../../pages/Home"; // Página principal (catálogo) -> Crítica, no lazy-load.
import ProtectedRoute from "../templates/ProtectedRoute/ProtectedRoute"; // Componente para proteger rutas privadas.

// Lazy loading para páginas no críticas (Code Splitting).
const Cart = lazy(() => import("../../pages/Cart"));
const CategoryPage = lazy(() => import("../../pages/CategoryPage"));
const Checkout = lazy(() => import("../../pages/Checkout"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const OrderConfirmation = lazy(() => import("../../pages/OrderConfirmation"));
const Orders = lazy(() => import("../../pages/Orders"));
const Product = lazy(() => import("../../pages/Product"));
const Profile = lazy(() => import("../../pages/Profile"));
const SearchResults = lazy(() => import("../../pages/SearchResults"));
const Settings = lazy(() => import("../../pages/Settings"));
const WishList = lazy(() => import("../../pages/WishList"));

// Componente principal de la aplicación.
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<Loading>Cargando sección...</Loading>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                
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
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<div>Ruta no encontrada</div>} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;