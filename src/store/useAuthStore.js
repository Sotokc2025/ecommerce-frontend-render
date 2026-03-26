// @ts-check
import { create } from 'zustand';
import * as authService from '../services/auth';
import { setLogoutCallback } from '../services/http';
/**
 * @typedef {Object} UserData
 * @property {string} [id]
 * @property {string} [_id]
 * @property {string} [email]
 * @property {string} [displayName]
 * @property {string} [role]
 */
/**
 * @typedef {Object} AuthState
 * @property {UserData | null} user
 * @property {string | null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {(email: string, password: string) => Promise<any>} login
 * @property {() => void} logout
 * @property {(userData: any) => Promise<any>} register
 * @property {() => string | null} getUserId
 */
/**
 * Store de Zustand para gestionar la autenticación global de la aplicación.
 * Reemplaza de forma eficiente a AuthContext reduciendo re-renders innecesarios.
 * 🛡️🚀✨
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AuthState>>}
 */
// @ts-ignore
export const useAuthStore = create((set, get) => ({
  user: authService.getCurrentUser(),
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        set({
          user: response.user,
          token: localStorage.getItem('authToken'),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: "Fallo de conexión" };
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  register: async (userData) => {
    return await authService.register(userData);
  },

  getUserId: () => {
    /** @type {AuthState} */
    const state = get();
    const user = state.user;
    if (!user) return null;
    return user._id || user.id || null;
  }
}));

// Registrar el callback de logout en el cliente HTTP para manejar 401 automáticamente
setLogoutCallback(() => useAuthStore.getState().logout());
