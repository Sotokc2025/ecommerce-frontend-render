// @ts-check
// Importa los componentes y páginas principales de la app.

import { lazy, Suspense } from "react"; // Para lazy loading y suspense.
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Para la navegación entre rutas.
import { AuthProvider } from "../../context/AuthContext"; // Proveedor de contexto para autenticación.
import { CartProvider } from "../../context/CartContext"; // Proveedor de contexto para el carrito.
import { NotificationProvider } from "../../context/NotificationContext"; // Proveedor de contexto para notificaciones.
import Layout from "../templates/Layout/Layout"; // Componente de layout general (header, footer, etc).
import Loading from "../atoms/Loading/Loading"; // Componente de carga para fallbacks.
import Home from "../../pages/Home"; // Página principal (catálogo) -> Crítica, no lazy-load.
const CategoryPage = lazy(() => import("../../pages/CategoryPage"));
import ProtectedRoute from "../templates/ProtectedRoute/ProtectedRoute"; // Componente para proteger rutas privadas.

// Lazy loading para páginas no críticas (Code Splitting).
const Cart = lazy(() => import("../../pages/Cart"));
const Checkout = lazy(() => import("../../pages/Checkout"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const OrderConfirmation = lazy(() => import("../../pages/OrderConfirmation"));
const Orders = lazy(() => import("../../pages/Orders"));
const Notifications = lazy(() => import("../../pages/Notifications"));
const Product = lazy(() => import("../../pages/Product"));
const Profile = lazy(() => import("../../pages/Profile"));
const SearchResults = lazy(() => import("../../pages/SearchResults"));
const Settings = lazy(() => import("../../pages/Settings"));
const WishList = lazy(() => import("../../pages/WishList"));

// Admin pages
const AdminDashboard = lazy(() => import("../../pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../../pages/Admin/AdminProducts"));
const AdminOrders = lazy(() => import("../../pages/Admin/AdminOrders"));
const AdminUsers = lazy(() => import("../../pages/Admin/AdminUsers"));

// Componente principal de la aplicación.
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
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
                    path="/profile/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
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
                  
                  {/* Rutas Admin */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<div>Ruta no encontrada</div>} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;