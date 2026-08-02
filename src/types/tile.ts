export interface Product {
  id: number;
  code: string;
  title_fa: string;
  title_en: string;
  title_ar?: string;
  collection_code: string;
  collection_name: string;
  size: '30x30' | '40x40' | '60x60' | '60x120' | '80x80' | '100x100' | '30x90';
  surface_finish: 'پولیش (Polished)' | 'مات (Matt)' | 'کاروینگ (Carving)' | 'شوگر (Sugar)' | 'براق (Glossy)' | 'لاپاتو (Lappato)';
  body_type: 'پرسلان فول بادی (Full Body Porcelain)' | 'پرسلان لعابدار (Glazed Porcelain)' | 'سرامیک بدنه سفید (White Body)';
  faces_count: number;
  thickness_mm: number;
  water_absorption: string;
  rectified: boolean;
  applications: string[];
  color_family: 'سفید و مرمر (White/Marble)' | 'خاکستری و بتن (Gray/Concrete)' | 'کرم و بژ (Beige/Cream)' | 'مشکی و اونیکس (Dark/Onyx)' | 'طرح چوب (Wood)' | 'متالیک و مدرن (Metallic)';
  image_url: string;
  face_images: string[];
  ambiance_images: string[];
  description: string;
  description_fa?: string;
  description_en?: string;
  description_ar?: string;
  featured?: boolean;
}

export interface Collection {
  id: number;
  code: string;
  name_fa: string;
  name_en: string;
  tagline: string;
  image_url: string;
  available_sizes: string[];
}

export interface FilterState {
  search: string;
  sizes: string[];
  finishes: string[];
  bodyType: string;
  collection: string;
  colorFamily: string;
  application: string;
}

export interface InquiryItem {
  product: Product;
  quantitySqm: number;
}
