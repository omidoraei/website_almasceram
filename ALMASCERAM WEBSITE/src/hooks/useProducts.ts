/**
 * @fileoverview Custom Hook for Fetching & Filtering Catalog Products.
 * @description Manages API data-fetching lifecycle, debounced filter updates,
 * error handling, and loading states for the Almas Ceram catalog.
 */

import { useState, useEffect } from 'react';
import { Product, FilterState } from '../types/tile';
import { API_ENDPOINTS } from '../constants';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetchProducts: () => void;
}

export function useProducts(
  searchQuery: string,
  selectedQuickSize: string,
  filters: FilterState,
  viewMode: 'catalog' | 'admin'
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedQuickSize) params.append('size', selectedQuickSize);
      else if (filters.sizes.length > 0) params.append('size', filters.sizes.join(','));
      if (filters.finishes.length > 0) params.append('finish', filters.finishes.join(','));
      if (filters.bodyType) params.append('body', filters.bodyType);
      if (filters.collection) params.append('collection', filters.collection);

      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`);
      if (!res.ok) throw new Error('خطا در دریافت کاتالوگ محصولات');
      const data = await res.json();
      setProducts(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ارتباط با سرور برقرار نشد.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedQuickSize, filters, viewMode]);

  return {
    products,
    loading,
    error,
    refetchProducts: fetchProducts
  };
}
