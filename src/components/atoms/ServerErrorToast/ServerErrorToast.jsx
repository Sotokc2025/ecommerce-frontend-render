// @ts-check
import React, { useEffect, useState } from 'react';
import './ServerErrorToast.css';

/**
 * Componente que escucha el evento global 'app:server-error'
 * despachado por el interceptor de Axios y muestra un toast de error.
 * Se monta una sola vez en el Layout — no requiere props.
 */
const ServerErrorToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleServerError = (event) => {
      const { message } = event.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message }]);

      // Auto-dismiss tras 5 segundos
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    window.addEventListener('app:server-error', handleServerError);
    return () => window.removeEventListener('app:server-error', handleServerError);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast toast--error">
          <span className="toast-icon">⚠</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ServerErrorToast;
