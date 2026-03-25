import React, { useEffect } from "react";
import "./Modal.css";
import Icon from "../Icon/Icon";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Manejar cierre con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Bloquear scroll del body
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <Icon name="x" size={24} />
          </button>
        </header>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
