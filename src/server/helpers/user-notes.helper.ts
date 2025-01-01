import { SupabaseClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from './auth-helper';

export const getUserNoteId = async (): Promise<{
  userNoteId: string;
  supabase: SupabaseClient;
}> => {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { data: userNote, error } = await supabase
      .from('user_notes')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('User Note Fetch Error:', error);
      throw new Error('Failed to fetch user note id');
    }

    return { userNoteId: userNote.id, supabase }; // supabase を一緒に返す
  } catch (error) {
    console.error('Error in getUserNoteId:', error);
    throw error;
  }
};
