'use server';
import { createClient } from '@/utils/supabase/server';

export async function otp(formData: {
  email: string;
  oneTimePassword: string;
}): Promise<{ success: boolean; errorCode?: string; userRole?: string }> {
  const supabase = await createClient();

  // OTP認証リクエスト
  const { error } = await supabase.auth.verifyOtp({
    email: formData.email,
    token: formData.oneTimePassword,
    type: 'email',
  });

  if (error) {
    console.log('OTP認証エラー: トークンが無効または期限切れです', {
      code: error.code || 'unknown_error',
      details: error.message,
    });

    return {
      success: false,
      errorCode: error.code || 'unknown_error',
    };
  }

  // セッション確認
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !data?.session) {
    console.log('セッション取得エラー:', sessionError);
    return { success: false, errorCode: 'session_not_found' };
  }

  const session = data.session; // 型が確認できたので安心してアクセス

  // ユーザー情報取得
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.log('ユーザーデータ取得エラー:', userError);
    return { success: false, errorCode: 'user_not_found' };
  }

  // ロール情報取得（ロールが見つからなくてもエラーにはしない）
  let userRole: string | undefined;
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .single();

  if (roleError || !roleData) {
    console.log('ロール情報取得エラー（ただし処理は続行します）:', roleError || 'ロール情報なし');
  } else {
    userRole = roleData.role; // ロールが見つかった場合のみ設定
  }

  // クッキー設定（サーバーサイドで）
  supabase.auth.setSession({
    access_token: session.access_token, // session 型が正しく確認できたので問題なし
    refresh_token: session.refresh_token,
  });

  return { success: true, userRole };
}

// OTP送信
export async function sendOtpToEmail(data: { email: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
