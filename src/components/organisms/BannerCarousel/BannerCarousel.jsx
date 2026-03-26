// @ts-check
// Importa React y hooks para estado y efectos.
import React, { useState, useEffect } from "react";
// Importa PropTypes para validar las props del componente.
import PropTypes from "prop-types";
// Importa los estilos CSS del carrusel.
import "./BannerCarousel.css";
// Importa el componente Button reutilizable.
import Button from "../../atoms/Button";
// Importa el componente Icon para mostrar íconos.
import Icon from "../../atoms/Icon/Icon";


// Componente funcional BannerCarousel que muestra un carrusel de banners.
export default function BannerCarousel({ banners = [] }) {
  // Estado para el índice actual del banner.
  const [currentIndex, setCurrentIndex] = useState(0);
  // Estado para controlar la transición o efecto visual cuando cambias de un banner a otro.
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efecto para cambiar automáticamente el banner cada 5 segundos.
  useEffect(() => {
    if (banners.length <= 1) return;

    //Esto ejecuta la función interna cada 5 segundos (5000 milisegundos).  
    //hace que el carrusel avance automáticamente al siguiente banner cada
    //5 segundos, y cuando llega al último, vuelve al primero, creando un ciclo infinito.
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    //Cuando el componente se desmonta o cuando cambia la dependencia [banners.length], 
    //ejecuta esta función para limpiar el intervalo  
    return () => clearInterval(interval);
  }, [banners.length]);

  // Función para ir a un banner específico.
  /*Si el carrusel está en medio de una transición (isTransitioning es true) o 
  si el usuario intenta ir al mismo banner en el que ya está (index === currentIndex), la función no hace nada y termina.
setIsTransitioning(true);
Activa el estado de transición para evitar que el usuario cambie de banner varias veces rápidamente.setCurrentIndex(index);
Cambia el banner actual al que corresponde al índice recibido.
setTimeout(() => setIsTransitioning(false), 300);
Después de 300 milisegundos (el tiempo estimado de la animación), desactiva el estado de transición
para permitir nuevos cambios.*/
  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Función para ir al banner anterior.
  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Función para ir al siguiente banner.
  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Maneja la navegación con teclado (Enter o espacio).
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // Si no hay banners, muestra un mensaje de vacío.
  if (banners.length === 0) {
    return (
      <div className="banner-carousel">
        <div className="banner-empty">
          <Icon name="image" size={48} />
          <h3>No hay banners disponibles</h3>
          <p>Los banners aparecerán aquí cuando estén disponibles</p>
        </div>
      </div>
    );
  }

  // Renderiza el carrusel de banners.
  return (
    <div className="banner-carousel">
      <div
        className="carousel-container"
        role="region"
        aria-label="Carrusel de banners promocionales"
      >
        {/* Contenedor de slides */}
        <div className="slides-wrapper">
          {banners.map((banner, index) => {
            return (
              <div
                key={banner.id || index}
                className={`banner-slide ${index === currentIndex ? "active" : ""
                  } ${index === currentIndex - 1 ||
                    (currentIndex === 0 && index === banners.length - 1)
                    ? "prev"
                    : ""
                  } ${index === currentIndex + 1 ||
                    (currentIndex === banners.length - 1 && index === 0)
                    ? "next"
                    : ""
                  }`}
                style={{
                  "--banner-bg": banner.backgroundColor || "var(--surface)",
                  backgroundImage: `url(${banner.image})`,
                }}
                aria-hidden={index !== currentIndex}
              >
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <div className="content-wrapper">
                    <h1 className="banner-title">{banner.title}</h1>
                    <p className="banner-subtitle">{banner.subtitle}</p>
                    <div className="banner-actions">
                      {/* Botón principal del banner */}
                      <Button
                        variant="primary"
                        size="large"
                        onClick={() => {
                          console.log(`Navegando a: ${banner.buttonLink}`);
                          // Aquí iría la navegación real
                        }}
                        aria-label={`${banner.buttonText} - ${banner.title}`}
                      >
                        {banner.buttonText}
                      </Button>
                      {/* Botón secundario opcional */}
                      {banner.secondaryButton && (
                        <Button
                          variant="secondary"
                          size="large"
                          onClick={() =>
                            console.log(`Acción secundaria: ${banner.title}`)
                          }
                        >
                          {banner.secondaryButton}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controles de navegación */}
        {banners.length > 1 && (
          <>
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={goToPrevious}
              onKeyDown={(e) => handleKeyDown(e, goToPrevious)}
              aria-label="Banner anterior"
              disabled={isTransitioning}
            >
              <Icon name="chevronLeft" size={24} />
            </button>

            <button
              className="carousel-btn carousel-btn-next"
              onClick={goToNext}
              onKeyDown={(e) => handleKeyDown(e, goToNext)}
              aria-label="Banner siguiente"
              disabled={isTransitioning}
            >
              <Icon name="chevronRight" size={24} />
            </button>
          </>
        )}

        {/* Indicadores de posición */}
        {banners.length > 1 && (
          <div className="carousel-indicators" role="tablist">
            {banners.map((banner, index) => (
              <button
                key={banner.id || index}
                className={`indicator ${index === currentIndex ? "active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                onKeyDown={(e) => handleKeyDown(e, () => goToSlide(index))}
                aria-label={`Ir al banner ${index + 1}: ${banner.title}`}
                role="tab"
                aria-selected={index === currentIndex}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}

        <div className="carousel-progress">
          <div
            className="progress-bar"
            style={{
              "--progress-width": `${((currentIndex + 1) / banners.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Contador de banners */}
        <div className="banner-counter">
          <span>{currentIndex + 1}</span>
          <span className="divider">/</span>
          <span>{banners.length}</span>
        </div>
      </div>
    </div>
  );
}

// Validación de las props que recibe el componente.
BannerCarousel.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      image: PropTypes.string.isRequired,
      button: PropTypes.shape({
        text: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
    })
  ),
};

// Valor por defecto para la prop banners.
BannerCarousel.defaultProps = {
  banners: [],
};
//si el componente BannerCarousel no recibe la prop banners
// (es decir, si no le pasan ningún arreglo de banners al usarlo),
// entonces por defecto usará un arreglo vacío ([]).