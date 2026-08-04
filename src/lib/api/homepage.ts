import { supabase } from './supabase';

export interface HomepageContent {
  id: string;
  section_key: string;
  content_json: any;
  is_active: boolean;
  updated_at: string;
}

export const getHomepageContent = async (): Promise<HomepageContent[]> => {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching homepage content:', error);
    throw error;
  }

  return data || [];
};

export const getHomepageContentByKey = async (sectionKey: string): Promise<HomepageContent | null> => {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .eq('section_key', sectionKey)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching homepage content by key:', error);
    return null;
  }

  return data;
};

export const updateHomepageContent = async (id: string, content: Partial<HomepageContent>): Promise<HomepageContent | null> => {
  const { data, error } = await supabase
    .from('homepage_content')
    .update({ ...content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating homepage content:', error);
    return null;
  }

  return data;
};

export const createHomepageContent = async (content: Partial<HomepageContent>): Promise<HomepageContent | null> => {
  const { data, error } = await supabase
    .from('homepage_content')
    .insert([{ ...content, updated_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error('Error creating homepage content:', error);
    return null;
  }

  return data;
};

export const upsertHomepageContent = async (sectionKey: string, contentJson: any): Promise<HomepageContent | null> => {
  // First try to find existing record
  const existing = await getHomepageContentByKey(sectionKey);
  
  if (existing) {
    return await updateHomepageContent(existing.id, { content_json: contentJson });
  } else {
    return await createHomepageContent({
      section_key: sectionKey,
      content_json: contentJson,
      is_active: true
    });
  }
};
