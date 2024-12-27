// src/server/router/auth.router.ts
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

export const authRouter = router({
  sendOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });

        if (error) {
          console.error('OTP送信エラー:', error);
          throw new Error('メール送信に失敗しました。');
        }

        return { message: '認証メールを送信しました。' };
      } catch (error) {
        console.error('OTP送信処理エラー:', error);
        throw new Error('認証処理中にエラーが発生しました。');
      }
    }),
  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, token } = input;

      try {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });

        if (error) {
          console.error('OTP検証エラー:', error);
          return { success: false, error: error.message };
        }

        // verifyOtpが成功すればセッションは確立されているため、setSessionは不要
        return { success: true };
      } catch (error) {
        console.error('OTP検証処理エラー:', error);
        return { success: false, error: '処理中にエラーが発生しました。' };
      }
    }),
  verifyOtpAndSetSession: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, token } = input;

      try {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });

        if (error) {
          console.error('OTP検証エラー:', error);
          return { success: false, error: error.message };
        }

        // verifyOtpが成功すればセッションは確立されているため、setSessionは不要
        return { success: true };
      } catch (error) {
        console.error('OTP検証処理エラー:', error);
        return { success: false, error: '処理中にエラーが発生しました。' };
      }
    }),
});
