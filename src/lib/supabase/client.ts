import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Database 型をインポート

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  (() => {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.');
  })();
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  (() => {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
  })();

// Supabase クライアントを型付きで作成
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
