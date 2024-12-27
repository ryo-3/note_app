// server/router/notes.router.ts
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

export const notesRouter = router({
  getAllNotes: publicProcedure.query(async () => {
    try {
      const { data, error } = await supabase.from('notes').select('*');
      if (error) {
        console.error('Error fetching notes:', error);
        throw new Error('Failed to fetch notes');
      }

      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  }),

  getNoteById: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const { data, error } = await supabase.from('notes').select('*').eq('id', input).single();
      if (error) {
        console.error('Error fetching note:', error);
        throw new Error('Failed to fetch note');
      }
      return data;
    } catch (error) {
      console.error('Error fetching note:', error);
      throw new Error('Failed to fetch note');
    }
  }),
});
