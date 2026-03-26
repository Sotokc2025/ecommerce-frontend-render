// @ts-check

// Importa los hooks necesarios de React para crear el contexto y manejar el estado.
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Crea el contexto de tema (claro/oscuro).
const ThemeContext = createContext(null);
// Clave para guardar el tema en localStorage.
const THEME_STORAGE_KEY = "app:theme";

// Obtiene el tema inicial: desde localStorage, preferencia del sistema o por defecto "light".
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (fromStorage === "light" || fromStorage === "dark") return fromStorage;
  } catch {}
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Proveedor del contexto de tema, envuelve la app.
export function ThemeProvider({ children }) {
  // Estado del tema actual.
  const [theme, setTheme] = useState(getInitialTheme);

  // Efecto para guardar el tema en localStorage y actualizar el atributo en el DOM.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      console.log("Tema cambiado a:", theme);
    }
  }, [theme]);

  // Memoiza el valor del contexto para evitar renders innecesarios.
  const value = useMemo(() => {
    const isDarkMode = theme === "dark";
    // Función para alternar entre tema claro y oscuro.
    const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    };
    return { theme, isDarkMode, toggleTheme, setTheme };
  }, [theme]);

  // Renderiza el proveedor del contexto con los hijos.
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook para consumir el contexto de tema.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
