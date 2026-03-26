// @ts-check

// Importa los hooks y componentes necesarios para la barra de navegación.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import { fetchCategories } from "../../../services/categoryService";
import "./Navigation.css";

// Componente Navigation: muestra las categorías y enlaces especiales.
const Navigation = ({ isMobile = false, onLinkClick }) => {
  // Estado para las categorías principales y el estado del dropdown.
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // useEffect para cargar y filtrar las categorías desde el backend.
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setAllCategories(categoriesData);

        // Obtiene los IDs de las categorías que son padres de otras.
        const allParentIds = new Set(
          categoriesData
            .filter((cat) => cat.parentCategory)
            .map((cat) => cat.parentCategory._id || cat.parentCategory)
        );

        // Filtra las categorías que son padres o no tienen parent.
        const mainCategories = categoriesData.filter(
          (cat) => !cat.parentCategory || allParentIds.has(cat._id)
        );

        setCategories(mainCategories);
      } catch (err) {
        console.error("Error loading categories in Navigation:", err);
      }
    };

    loadCategories();
  }, []);

  // Función para obtener subcategorías de una categoría principal.
  const getSubcategories = (parentId) => {
    const subcategories = allCategories.filter(
      (cat) => {
        const catParentId = cat.parentCategory?._id || cat.parentCategory;
        return catParentId === parentId;
      }
    );
    return subcategories.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Si es versión móvil, renderiza solo los enlaces principales y especiales.
  if (isMobile) {
    return (
      <div className="mobile-navigation">
        {/* Enlaces especiales para móvil */}
        <Link
          to="/offers"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="tag" size={20} />
          Ofertas del día
        </Link>
        <Link
          to="/new"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="sparkles" size={20} />
          Novedades
        </Link>
        <Link
          to="/bestsellers"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="star" size={20} />
          Más vendidos
        </Link>
        <Link
          to="/flash-sale"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="zap" size={20} />
          Flash sale
        </Link>

        {/* Renderiza las categorías principales */}
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="mobile-nav-link"
            onClick={onLinkClick}
          >
            <Icon name="chevronRight" size={16} />
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  // Renderiza la barra de navegación para desktop.
  return (
    <div className="navigation">
      <div className="container">
        <div className="navigation-content">
          {/* Menú desplegable de todas las categorías */}
          <div className="categories-dropdown">
            <button
              className="categories-menu-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              data-testid="categories-menu-btn"
            >
              <Icon name="menu" size={16} />
              <span>Todas las categorías</span>
              <Icon name="chevronDown" size={14} />
            </button>

            {/* Dropdown con categorías y subcategorías */}
            {isDropdownOpen && (
              <div className="categories-dropdown-menu">
                {categories.map((category) => {
                  const subcategories = getSubcategories(category._id);
                  return (
                    <div key={category._id} className="category-group">
                      <Link
                        to={`/category/${category._id}`}
                        className="category-link main-category"
                      >
                        {category.name}
                        {subcategories.length > 0 && (
                          <Icon name="chevronRight" size={12} />
                        )}
                      </Link>

                      {/* Subcategorías si existen */}
                      {subcategories.length > 0 && (
                        <div className="subcategories">
                          {subcategories.map((subcat) => (
                            <Link
                              key={subcat._id}
                              to={`/category/${subcat._id}`}
                              className="category-link sub-category"
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navegación horizontal (puedes agregar más enlaces aquí si lo deseas) */}
          <nav className="categories-nav">
            {/* Aquí solo van las categorías principales */}
          </nav>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente Navigation.
export default Navigation;
