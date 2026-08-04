import { supabase } from './supabase';

export interface PortfolioItem {
  id: string;
  project_name: string;
  client_name: string | null;
  location: string | null;
  completion_year: number | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio items:', error);
    throw error;
  }

  return data || [];
};

export const createPortfolioItem = async (item: Partial<PortfolioItem>): Promise<PortfolioItem | null> => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating portfolio item:', error);
    return null;
  }

  return data;
};

export const updatePortfolioItem = async (id: string, item: Partial<PortfolioItem>): Promise<PortfolioItem | null> => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(item)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating portfolio item:', error);
    return null;
  }

  return data;
};

export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }

  return true;
};
