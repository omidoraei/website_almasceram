/**
 * @fileoverview Central Constants & Configuration Definitions for Almas Ceram.
 * @description Serves as the single source of truth for mandatory tile sizes,
 * surface finishes, body types, API endpoint paths, and fallback asset URLs.
 */

export const MANDATORY_TILE_SIZES = [
  '30x30',
  '40x40',
  '60x60',
  '60x120',
  '80x80',
  '100x100',
  '30x90'
] as const;

export const SURFACE_FINISHES = [
  'پولیش (Polished)',
  'مات (Matt)',
  'کاروینگ (Carving)',
  'شوگر (Sugar)',
  'براق (Glossy)',
  'لاپاتو (Lappato)'
] as const;

export const BODY_TYPES = [
  'پرسلان فول بادی (Full Body Porcelain)',
  'پرسلان لعابدار (Glazed Porcelain)',
  'سرامیک بدنه سفید (White Body)'
] as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  INQUIRY: '/api/inquiry',
  CONTACT_REQUESTS: '/api/contact-requests',
  HOMEPAGE_CONTENT: '/api/homepage-content',
  COLLECTIONS: '/api/collections',
  SITEMAP: '/api/sitemap'
} as const;

export const DEFAULT_ASSETS = {
  TILE_FALLBACK: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  HERO_BACKGROUND: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  FACTORY_QUALITY: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '989121112233'
} as const;

export const MAX_COMPARE_LIMIT = 4;
export const DEFAULT_INQUIRY_SQM = 50;
