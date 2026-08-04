import { supabase } from './supabase';

export interface ContactRequest {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  subject: string | null;
  message: string;
  status: string;
  ip_address: string | null;
  created_at: string;
}

export const submitContactRequest = async (request: Partial<ContactRequest>): Promise<ContactRequest | null> => {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact request:', error);
    return null;
  }

  return data;
};

export const getContactRequests = async (): Promise<ContactRequest[]> => {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact requests:', error);
    throw error;
  }

  return data || [];
};

export const updateContactRequestStatus = async (id: string, status: string): Promise<ContactRequest | null> => {
  const { data, error } = await supabase
    .from('contact_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact request status:', error);
    return null;
  }

  return data;
};
