import { useState, useEffect } from 'react';
import * as productsApi from '../api/products.api';

const useProducts = (options = {}) => {
  const { category = null, immediate = true } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(immediate);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = category
        ? await productsApi.getProducts({ category })
        : await productsApi.getProducts();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) fetchProducts();
  }, [category, immediate]);

  return { products, loading, refetch: fetchProducts };
};

export default useProducts;
