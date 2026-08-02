/**
 * @fileoverview Custom Hook for Price Quote Inquiry Basket Management.
 * @description Encapsulates items addition, removal, quantity adjustments,
 * and state persistence for customer price requests.
 */

import { useState } from 'react';
import { Product, InquiryItem } from '../types/tile';
import { DEFAULT_INQUIRY_SQM } from '../constants';

export function useInquiryBasket() {
  const [inquiryBasket, setInquiryBasket] = useState<InquiryItem[]>([]);

  const handleAddToInquiry = (product: Product) => {
    setInquiryBasket((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product, quantitySqm: DEFAULT_INQUIRY_SQM }];
    });
  };

  const handleUpdateInquiryQuantity = (productId: number, sqm: number) => {
    setInquiryBasket((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantitySqm: sqm } : item))
    );
  };

  const handleRemoveInquiryItem = (productId: number) => {
    setInquiryBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearInquiryBasket = () => {
    setInquiryBasket([]);
  };

  return {
    inquiryBasket,
    handleAddToInquiry,
    handleUpdateInquiryQuantity,
    handleRemoveInquiryItem,
    handleClearInquiryBasket
  };
}
