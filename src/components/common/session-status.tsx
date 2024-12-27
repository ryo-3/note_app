'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionStatus() {
  useEffect(() => {
    const handleLogin = async () => {
      // ハッシュ部分を取得してパース
      const hash = window.location.hash.substring(1); // `#`を削除
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      console.log('取得したトークン:', { accessToken, refreshToken });

      if (accessToken && refreshToken) {
        // Supabaseにセッションを設定
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error) {
          console.log('セッションが正常に設定されました');

          // クッキーにトークンを保存
          document.cookie = `access_token=${accessToken}; path=/; secure; HttpOnly; max-age=${60 * 60 * 24 * 7}`;
          document.cookie = `refresh_token=${refreshToken}; path=/; secure; HttpOnly; max-age=${60 * 60 * 24 * 30}`;

          console.log('クッキーにトークンを保存しました');
          console.log('現在のクッキー:', document.cookie);
        } else {
          console.error('セッション設定エラー:', error);
        }
      } else {
        console.log('トークンが存在しません');
      }
    };

    handleLogin();
  }, []);

  return <div>ログイン処理中...</div>;
}
