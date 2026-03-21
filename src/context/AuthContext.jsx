import { createContext, useContext, useEffect, useState } from "react";
import * as authUtils from "../services/auth";
import { setLogoutCallback } from "../services/http";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Registrar el callback de logout en el cliente HTTP
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = authUtils.getCurrentUser();
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Maneja el inicio de sesión.
   * Centraliza la llamada a la API y la actualización del estado.
   */
  const login = async (email, password) => {
    const response = await authUtils.login(email, password);
    if (response.success) {
      setUser(response.user);
      setToken(localStorage.getItem("authToken"));
    }
    return response;
  };

  /**
   * Maneja el cierre de sesión.
   * Limpia el estado reactivo y el almacenamiento persistente.
   */
  const logout = () => {
    authUtils.logout();
    setUser(null);
    setToken(null);
  };

  /**
   * Maneja el registro de usuario.
   */
  const register = async (userData) => {
    return await authUtils.register(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de autenticación.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
