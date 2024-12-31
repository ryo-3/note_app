import { createClient } from '@/lib/supabase/server';

export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError); // エラーをログに出力
      throw new Error(`Failed to get session: ${sessionError.message}`); // より具体的なエラーメッセージ
    }
    if (!sessionData?.session?.access_token) {
      console.error('Session data is missing access token:', sessionData); // 欠落しているデータをログ出力
      throw new Error('Access token is missing in session'); // 具体的なエラーメッセージ
    }
    const accessToken = sessionData.session.access_token;

    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError) {
      console.error('Error getting user:', userError); // エラーをログに出力
      throw new Error(`Failed to get user: ${userError.message}`); // より具体的なエラーメッセージ
    }
    if (!userData?.user) {
      console.error('User data is missing:', userData); // 欠落しているデータをログ出力
      throw new Error('User data is missing'); // 具体的なエラーメッセージ
    }

    return { supabase, user: userData.user };
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error); // getAuthenticatedUser全体のエラーを捕捉
    throw error; // エラーを再throw
  }
}
