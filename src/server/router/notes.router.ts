import { publicProcedure, router } from '../trpc';
import { getAuthenticatedUser } from '../helpers/auth-helper';

export const notesRouter = router({
  getAllNotes: publicProcedure.query(async () => {
    const { supabase, user } = await getAuthenticatedUser();

    // 認証情報に基づいてデータを取得 (JOIN クエリ)
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*, user_notes!inner(user_id)')
      .eq('user_notes.user_id', user.id);

    if (notesError) {
      console.error('Notes Fetch Error:', notesError);
      throw new Error('Failed to fetch notes');
    }

    console.log('Fetched Notes:', notes);
    return notes;
  }),
});
