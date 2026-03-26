// @ts-check
import React from "react";
import Modal from "../../atoms/Modal/Modal";
import Icon from "../../atoms/Icon/Icon";
import "./CategoryModal.css";

const CATEGORY_DATA = {
  triplay: {
    title: "Triplay Estructural",
    icon: "layers",
    description: "El triplay (contrachapado) es la columna vertebral de la carpintería moderna. Formado por capas cruzadas de madera de alta calidad, ofrece una estabilidad estructural inigualable. Ideal para cimbras, muebles resistentes y acabados arquitectónicos de primer nivel.",
    features: ["Resistencia superior", "Estabilidad dimensional", "Diversos espesores"],
    color: "#4CAF50"
  },
  "maderas finas": {
    title: "Maderas Finas y de Lujo",
    icon: "treeDeciduous",
    description: "La expresión máxima de la elegancia natural. Desde el profundo tono rojizo de la Caoba hasta la veta única del Nogal, nuestras maderas finas son seleccionadas para proyectos de ebanistería de lujo, instrumentos musicales y decoración premium.",
    features: ["Veteados únicos", "Durabilidad extrema", "Acabados de lujo"],
    color: "#8D6E63"
  },
  herramientas: {
    title: "Herramientas Profesionales",
    icon: "hammer",
    description: "Equipo profesional para resultados extraordinarios. Contamos con una selección curada de herramientas manuales de precisión y equipos eléctricos de alto rendimiento (sierras, routers, taladros) diseñados para el artesano más exigente.",
    features: ["Precisión industrial", "Ergonomía avanzada", "Marcas líderes"],
    color: "#FF9800"
  },
  accesorios: {
    title: "Accesorios y Complementos",
    icon: "component",
    description: "Los detalles que marcan la diferencia. Herrajes, pegamentos industriales, acabados especializados y complementos técnicos que aseguran que cada ensamble y cada proyecto tenga un acabado de nivel industrial.",
    features: ["Herrajes técnicos", "Adhesivos industriales", "Acabados finos"],
    color: "#03A9F4"
  },
  ofertas: {
    title: "Ofertas Exclusivas",
    icon: "tag",
    description: "Calidad premium a precios de oportunidad. Encuentra lotes especiales, herramientas seleccionadas y maderas con descuentos exclusivos. La oportunidad perfecta para elevar tu taller sin comprometer el presupuesto.",
    features: ["Precios imbatibles", "Stock limitado", "Calidad garantizada"],
    color: "#E91E63"
  }
};

const CategoryModal = ({ categoryName, isOpen, onClose }) => {
  const data = CATEGORY_DATA[categoryName.toLowerCase()];

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={data.title}>
      <div className="category-modal-body">
        <div className="category-icon-wrapper" style={{ background: `${data.color}15`, color: data.color }}>
          <Icon name={data.icon} size={48} />
        </div>
        
        <p className="category-description">
          {data.description}
        </p>

        <div className="category-features">
          {data.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <Icon name="checkCircle" size={16} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button 
          className="category-cta-btn" 
          onClick={onClose}
          style={{ background: `linear-gradient(135deg, ${data.color}, ${data.color}dd)` }}
        >
          Ver productos de {categoryName}
        </button>
      </div>
    </Modal>
  );
};

export default CategoryModal;
