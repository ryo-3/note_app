import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // クライアント作成時に現在のクッキーをログ出力
  // console.log("クライアント作成時のクッキー:", document.cookie);

  // セッションがあるかを確認するためのデバッグ用関数を追加
  // client.auth.getSession().then(({ data: { session }, error }) => {
  //   if (error) {
  //     console.error("クライアント側でセッション取得中のエラー:", error);
  //   } else {
  //     console.log("クライアント側で取得したセッション:", session);
  //   }
  // });

  return client;
}
