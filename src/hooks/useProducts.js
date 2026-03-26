// @ts-check
import { useState, useEffect } from "react";
import { fetchProducts, fetchBestSellers } from "../services/productService";
import { getCategoryById, getProductsByCategoryAndChildren, fetchCategories } from "../services/categoryService";

/**
 * Hook para la Home: Carga productos generales y los más vendidos.
 */
export function useHomeProducts() {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pData, bsData] = await Promise.all([
          fetchProducts(),
          fetchBestSellers()
        ]);
        setProducts(pData);
        setBestSellers(bsData);
      } catch (err) {
        setError("No se pudieron cargar los productos de madera. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return { products, bestSellers, loading, error };
}

/**
 * Hook para Categorías: Carga datos de la categoría y sus productos.
 * @param {string} categoryId 
 */
export function useCategoryProducts(categoryId) {
  const [category, setCategory] = useState(/** @type {any} */ (null));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (!categoryId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cData, pData] = await Promise.all([
          getCategoryById(categoryId),
          getProductsByCategoryAndChildren(categoryId),
        ]);

        if (!cData) {
          setError("Categoría de madera no encontrada");
          return;
        }

        setCategory(cData);
        setProducts(pData);
      } catch (err) {
        setError("Error al cargar la categoría o productos de madera");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryId]);

  return { category, products, loading, error };
}

/**
 * Hook para la Home: Carga las categorías principales (Sayer, Madera, etc)
 */
export function useHomeCategories() {
  const [categories, setCategories] = useState(/** @type {any[]} */ ([]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        // Filtramos solo las categorías principales (secuencia lógica Fase 5)
        const mainCats = data.filter((/** @type {any} */ cat) => !cat.parentCategory);
        setCategories(mainCats);
      } catch (err) {
        setError("Error al cargar categorías");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return { categories, loading, error };
}
