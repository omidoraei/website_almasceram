import { supabase } from './supabase';

export interface Standard {
  id: string;
  title_fa: string;
  title_en: string | null;
  code: string | null;
  description: string | null;
  icon_url: string | null;
  certificate_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getStandards = async (): Promise<Standard[]> => {
  const { data, error } = await supabase
    .from('standards')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching standards:', error);
    throw error;
  }

  return data || [];
};

export const createStandard = async (standard: Partial<Standard>): Promise<Standard | null> => {
  const { data, error } = await supabase
    .from('standards')
    .insert([standard])
    .select()
    .single();

  if (error) {
    console.error('Error creating standard:', error);
    return null;
  }

  return data;
};

export const updateStandard = async (id: string, standard: Partial<Standard>): Promise<Standard | null> => {
  const { data, error } = await supabase
    .from('standards')
    .update(standard)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating standard:', error);
    return null;
  }

  return data;
};

export const deleteStandard = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('standards')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting standard:', error);
    return false;
  }

  return true;
};
