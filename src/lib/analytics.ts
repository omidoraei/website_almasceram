// Google Analytics & Event Tracking Infrastructure for Almas Ceram
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
  console.log(`[Google Analytics Event]: ${eventName}`, params);
};

export const trackTileView = (productCode: string, title: string, size: string) => {
  trackEvent('view_item', {
    item_id: productCode,
    item_name: title,
    item_category: 'Ceramic Tiles',
    item_variant: size
  });
};

export const trackWhatsAppClick = (productCode?: string) => {
  trackEvent('contact_whatsapp', {
    product_code: productCode || 'general'
  });
};

export const trackInquirySubmit = (itemCount: number) => {
  trackEvent('generate_lead', {
    items_count: itemCount,
    lead_type: 'Tile Price Quote'
  });
};
