import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  // クライアントへのレスポンス用オブジェクト
  const supabaseResponse = NextResponse.next();

  // クッキーの内容を取得
  const cookies = request.cookies.getAll();

  // クッキー情報をログに出力
  // console.log('クッキー情報:', cookies);

  // Supabaseクライアントを作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // クッキーの読み取り
          return cookies;
        },
        setAll(cookiesToSet) {
          // console.log("setAllメソッド開始");
          // クッキーを `supabaseResponse` に追加
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          // console.log("セットされたcookies:", cookiesToSet);
        },
      },
    }
  );

  // セッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッション情報をログ出力
  // console.log('Middleware セッション情報:', session);
  // console.log("クッキー情報（再確認）:", cookies);

  if (session?.access_token) {
    // セッションが存在する場合のみユーザーデータを取得
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error('ユーザーデータ取得エラー:', userError);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url); // ログインページへリダイレクト
    }
    // // ロール情報を取得
    // const { data: userRole, error: roleError } = await supabase
    // .from("user_roles")
    // .select("role")
    // .eq("user_id", userData.user.id)
    // .single();

    // // `/admin` 配下へのアクセスを制限
    // if (request.nextUrl.pathname.startsWith("/admin")) {
    //   // ロール取得に失敗、または管理者ロールでない場合
    //   if (roleError || !userRole || userRole.role !== "admin") {
    //     console.error("アクセス拒否: 管理者権限が必要です");
    //     const url = request.nextUrl.clone();
    //     url.pathname = "/"; // トップページやエラーページにリダイレクト
    //     return NextResponse.redirect(url);
    //   }
    // }
    // if (userRole?.role) {
    //   // サーバーサイドでクッキーを設定
    //   supabaseResponse.cookies.set("userRole", userRole.role, {
    //     path: "/",
    //     httpOnly: true,
    //   });

    // }
  } else {
    // セッションがない場合の処理
    if (!request.nextUrl.pathname.startsWith('/login')) {
      console.log('middleware セッションが存在しません。リダイレクトします。');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url); // ログインページへリダイレクト
    }
  }
  return supabaseResponse; // 修正したレスポンスを返す
}
