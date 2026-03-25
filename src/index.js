// Importa la librería principal de React, necesaria para crear componentes y usar JSX.
import React from 'react';
// Importa el módulo de React para renderizar la aplicación en el DOM, usando la API moderna de React 18+.
import ReactDOM from "react-dom/client";
// Importa el componente principal App, que contiene la estructura y lógica de la aplicación.
import App from './components/App';
// Importa el proveedor de contexto de tema, que permite compartir el estado del tema en toda la app.
import { ThemeProvider } from "./context/ThemeContext";
// Importa los archivos de estilos globales para la aplicación.
import "./index.css";
import "./styles/madera-moderno.css";
// Importa una función para medir el rendimiento de la aplicación (opcional).
import reportWebVitals from './reportWebVitals';

import { HelmetProvider } from 'react-helmet-async';
// Crea la raíz de la aplicación React, vinculándola al elemento HTML con id 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));
// Renderiza la aplicación dentro de React.StrictMode (ayuda a detectar problemas en desarrollo).
// El ThemeProvider envuelve a App para que todos los componentes puedan acceder al contexto de tema.
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Si quieres medir el rendimiento de tu app, puedes pasar una función para registrar los resultados
// o enviarlos a un servicio externo. Más info: https://bit.ly/CRA-vitals
reportWebVitals();
