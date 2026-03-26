// @ts-check
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Hook personalizado para encapsular la lógica del Header (Context 7 Standard).
 * Desacopla el estado y los efectos de la representación visual.
*/
export const useHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isDarkMode, toggleTheme } = useTheme();
  // @ts-ignore
  const { getTotalItems } = useCart();
  // @ts-ignore
  const { user, isAuthenticated: isAuth, logout } = useAuth();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  /** @type {import('react').RefObject<HTMLDivElement>} */
  const userMenuRef = /** @type {any} */ (useRef(null));
  /** @type {import('react').RefObject<HTMLDivElement>} */
  const mobileMenuRef = /** @type {any} */ (useRef(null));
  /** @type {import('react').RefObject<HTMLInputElement>} */
  const searchInputRef = /** @type {any} */ (useRef(null));

  useEffect(() => {
    /** @param {KeyboardEvent} e */
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    /** @param {MouseEvent} e */
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(/** @type {Node} */ (e.target))) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(/** @type {Node} */ (e.target))) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  /** @param {React.FormEvent} e */
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query.length === 0) {
      navigate("/search");
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return {
    state: { isUserMenuOpen, isMobileMenuOpen, isMobileSearchOpen, searchQuery, isDarkMode, isAuth, user, totalItems },
    actions: { 
      setIsUserMenuOpen, setIsMobileMenuOpen, setIsMobileSearchOpen, setSearchQuery,
      toggleTheme, handleSearch, handleLogout,
      toggleUserMenu: () => setIsUserMenuOpen(!isUserMenuOpen),
      openMobileMenu: () => setIsMobileMenuOpen(true),
      closeMobileMenu: () => setIsMobileMenuOpen(false),
      toggleMobileSearch: () => setIsMobileSearchOpen(!isMobileSearchOpen)
    },
    refs: { userMenuRef, mobileMenuRef, searchInputRef }
  };
};