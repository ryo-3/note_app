import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { getUserNoteId } from '../helpers/user-notes.helper';
import { createClient } from '@/lib/supabase/server';

export const notesRouter = router({
  // メモの取得
  getAllNotes: publicProcedure.query(async () => {
    try {
      const { userNoteId, supabase } = await getUserNoteId();

      const { data: notes, error } = await supabase
        .from('notes')
        .select('*') // 必要なカラムを指定
        .eq('user_notes_id', userNoteId); // user_notes_id で絞り込み

      if (error) {
        console.error('Notes Fetch Error:', error);
        throw new Error('Failed to fetch notes');
      }

      // console.log('Fetched Notes:', notes);
      return notes;
    } catch (error) {
      console.error('Error in getAllNotes:', error);
      throw error;
    }
  }),

  // メモの作成
  createNote: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // user_notes の ID と supabase を取得
        const { userNoteId, supabase } = await getUserNoteId();

        const title = input.title || '無題のメモ';

        // 新しいメモを作成
        const { data: note, error } = await supabase
          .from('notes')
          .insert({
            title,
            content: input.content || '',
            created_at: new Date().toISOString(),
            user_notes_id: userNoteId,
          })
          .select()
          .single();

        if (error) {
          console.error('Note Creation Error:', error);
          throw new Error('Failed to create note');
        }

        console.log('Created Note:', note);
        return note;
      } catch (error) {
        console.error('Error in createNote:', error);
        throw error;
      }
    }),

  // メモの更新
  updateNote: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const supabase = await createClient();

        const { data: note, error } = await supabase
          .from(`notes`)
          .update({
            title: input.title || ``,
            content: input.content || ``,
          })
          .eq(`id`, input.id)
          .select();

        if (error) {
          console.error(`Note Update Error:`, error);
          throw new Error(`Failed to update note`);
        }
        // console.log(`Updated Note:`, note);
        return note;
      } catch (error) {
        console.error(`Error in updateNote:`, error);
        throw error;
      }
    }),

  // メモの削除
  deleteNote: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const supabase = await createClient();

        const { data: deletedNote, error } = await supabase
          .from(`notes`)
          .delete()
          .eq(`id`, input.id)
          .select();

        if (error) {
          console.error(`Note Deletion Error:`, error);
          throw new Error(`Failed to delete note`);
        }

        return deletedNote;
      } catch (error) {
        console.error(`Error in DeleteNote:`, error);
        throw error;
      }
    }),
});
