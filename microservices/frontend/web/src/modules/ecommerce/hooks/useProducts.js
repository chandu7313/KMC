import { useState, useEffect } from 'react';
import * as productsApi from '../api/products.api';

const useProducts = (options = {}) => {
  const { category = null, immediate = true } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(immediate);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = category
        ? await productsApi.getProducts({ category })
        : await productsApi.getProducts();
      const productsList = res?.products || res?.data?.products || (Array.isArray(res) ? res : []);
      setProducts(productsList);
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
