/**
 * @fileoverview Custom Hook for Tile Comparison Matrix.
 * @description Enforces comparison item limit (Max 4 items) and side-by-side selection.
 */

import { useState } from 'react';
import { Product } from '../types/tile';
import { MAX_COMPARE_LIMIT } from '../constants';

export function useTileCompare() {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= MAX_COMPARE_LIMIT) {
        alert(`حداکثر ${MAX_COMPARE_LIMIT} محصول را می‌توانید همزمان مقایسه کنید.`);
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveCompareItem = (product: Product | number) => {
    const id = typeof product === 'number' ? product : product.id;
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompareList = () => {
    setComparedProducts([]);
  };

  return {
    comparedProducts,
    handleToggleCompare,
    handleRemoveCompareItem,
    handleClearCompareList
  };
}
