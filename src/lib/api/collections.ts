import { supabase } from './supabase';

export interface Collection {
  id: string;
  name_fa: string;
  name_en: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const getCollections = async (): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }

  return data || [];
};

export const getCollectionBySlug = async (slug: string): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  return data;
};

export const createCollection = async (collection: Partial<Collection>): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .insert([collection])
    .select()
    .single();

  if (error) {
    console.error('Error creating collection:', error);
    return null;
  }

  return data;
};

export const updateCollection = async (id: string, collection: Partial<Collection>): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .update(collection)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating collection:', error);
    return null;
  }

  return data;
};

export const deleteCollection = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting collection:', error);
    return false;
  }

  return true;
};
