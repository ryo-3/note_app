import { type CookieOptions, createServerClient } from '@supabase/ssr';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

import type { Database } from '@/types/supabase';

export async function createClient() {
  const cookieStore = await cookies(); // cookies() を await で非同期取得

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '', {
    cookies: {
      get(name: string) {
        const cookieValue = cookieStore.get(name)?.value || null;
        // console.log(`Get Cookie: ${name} ->`, cookieValue); // クッキー取得ログ
        return cookieValue; // クッキーからアクセストークンを取得
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          const responseCookie = {
            name,
            value,
            ...options,
          } as ResponseCookie;
          // console.log(`Set Cookie: ${name} ->`, responseCookie); // クッキー設定ログ
          cookieStore.set(responseCookie);
        } catch (error) {
          console.error(`Error setting cookie ${name}:`, error); // エラーログ
        }
      },
    },
  });
}
