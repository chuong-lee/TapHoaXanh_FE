import { useState, useEffect } from 'react';

export function useProduct(options) {
  const [currentProduct, setCurrentProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [bestSellingProduct, setBestSellingProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setCurrentProduct(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err);
      setCurrentProduct([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategory(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err);
      setCategory([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProduct = async () => {
    setFeaturedLoading(true);
    try {
      const res = await fetch('/api/products?featured=true');
      const data = await res.json();
      setFeaturedProduct(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err);
      setFeaturedProduct([]);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Fetch best selling products
  const fetchBestSellingproduct = async () => {
    setFeaturedLoading(true);
    try {
      const res = await fetch('/api/products?sort=sold_desc');
      const data = await res.json();
      setBestSellingProduct(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err);
      setBestSellingProduct([]);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Filter by category
  const filterByCategory = (categoryId) => {
    if (!categoryId) return setCurrentProduct([]);
    setCurrentProduct(prev => prev.filter(p => p.categoryId === categoryId || (p.category && p.category.id === categoryId)));
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
    fetchFeaturedProduct();
    fetchBestSellingproduct();
  }, []);

  return {
    currentProduct,
    category,
    featuredProduct,
    bestSellingProduct,
    loading,
    categoryLoading,
    featuredLoading,
    error,
    fetchFeaturedProduct,
    fetchBestSellingproduct,
    filterByCategory,
    currentPage,
    setCurrentPage
  };
}