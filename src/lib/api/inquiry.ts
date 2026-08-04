import { supabase } from './supabase';

export interface Inquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  products_json: any;
  message: string | null;
  status: string;
  created_at: string;
}

export const submitInquiry = async (inquiry: Partial<Inquiry>): Promise<Inquiry | null> => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
    .single();

  if (error) {
    console.error('Error submitting inquiry:', error);
    return null;
  }

  return data;
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    throw error;
  }

  return data || [];
};

export const updateInquiryStatus = async (id: string, status: string): Promise<Inquiry | null> => {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating inquiry status:', error);
    return null;
  }

  return data;
};
