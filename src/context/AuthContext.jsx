// @ts-check
import { createContext, useContext } from "react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * @typedef {import('../store/useAuthStore').AuthState} AuthState
 */

/**
 * AuthContext (Proxy para Zustand).
 * Esta capa de compatibilidad permite migrar a Zustand (Fase 3) 
 * sin necesidad de refactorizar cada componente individualmente.
 * 🛡️🚀✨
 * @type {import('react').Context<AuthState | null>}
 */

const AuthContext = createContext(/** @type {any} */ (null));

/** @param {{ children: import('react').ReactNode }} props */
export function AuthProvider({ children }) {
  const store = useAuthStore();
  // Re-exportamos los valores del store como el valor del contexto para compatibilidad
  /** @type {AuthState} */
  const value = {
    ...store,
    login: store.login,
    logout: store.logout,
    register: store.register,
    getUserId: store.getUserId,
  };
  return (
    <AuthContext.Provider value={value}>
      {!store.isLoading && children}
    </AuthContext.Provider>
  );
}
/**
 * Hook useAuth: Ahora consume del store de Zustand vía Proxy de Contexto.
 * @returns {AuthState}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // @ts-ignore
    return useAuthStore();
  }
  return context;
}