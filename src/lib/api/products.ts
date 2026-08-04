import { supabase } from './supabase';

export interface Product {
  id: string;
  collection_id: string | null;
  name_fa: string;
  name_en: string | null;
  slug: string;
  description: string | null;
  price: number | null;
  discount_price: number | null;
  width: number | null;
  length: number | null;
  thickness: number | null;
  material_type: string | null;
  surface_type: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  stock_quantity: number | null;
  is_new: boolean;
  is_best_seller: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(name_fa, name_en, slug)')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(name_fa, name_en, slug)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const getProductsByCollection = async (collectionSlug: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(name_fa, name_en, slug)')
    .eq('collections.slug', collectionSlug)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching products by collection:', error);
    throw error;
  }

  return data || [];
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
};
