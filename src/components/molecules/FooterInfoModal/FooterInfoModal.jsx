// @ts-check
import React from "react";
import PropTypes from "prop-types";
import Modal from "../../atoms/Modal/Modal";
import Icon from "../../atoms/Icon/Icon";
import "../../molecules/CategoryModal/CategoryModal.css";

const FooterInfoModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const { title, icon, description, features, color, ctaText } = data;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="category-modal-body">
        <div
          className="category-icon-wrapper"
          style={{ background: `${color}18`, color }}
        >
          <Icon name={icon} size={48} />
        </div>

        <p className="category-description">{description}</p>

        <div className="category-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <Icon name="checkCircle" size={16} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          className="category-cta-btn"
          onClick={onClose}
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          }}
        >
          {ctaText || "¡Entendido!"}
        </button>
      </div>
    </Modal>
  );
};

FooterInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string,
    ctaText: PropTypes.string,
  }),
};

export default FooterInfoModal;
