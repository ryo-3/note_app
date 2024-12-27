'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { clientApi } from '@/app/_trpc/client';
import { supabase } from '@/lib/supabase/client';

// Zodスキーマを定義
const formSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  otp: z.string().optional(), // ワンタイムパスワードのフィールドを追加
});

export const LoginForm: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // useMutationを宣言
  const { mutateAsync: sendOtp, isLoading } = clientApi.auth.sendOtp.useMutation();
  const { mutateAsync: verifyOtp, isLoading: isVerifying } = clientApi.auth.verifyOtp.useMutation();

  const handleSendOtp = async (data: { email: string }) => {
    try {
      const response = await sendOtp(data); // サーバーにメールアドレスを送信
      console.log('認証メール送信成功:', response);
      setIsOtpSent(true); // OTP送信成功後に切り替える
    } catch (error) {
      console.error('認証メール送信エラー:', error);
    }
  };

  const handleVerifyOtp = async (data: { email: string; otp: string }) => {
    try {
      const response = await verifyOtp({
        email: data.email,
        token: data.otp, // `otp` を `token` にマッピング
      });

      console.log('OTP認証成功:', response);

      // セッション確認
      const { data: session, error } = await supabase.auth.getSession();
      if (error || !session) {
        throw new Error('セッションの保存に失敗しました');
      }

      console.log('セッションが正常に設定されました:', session);
    } catch (error) {
      console.error('OTP認証エラー:', error);
      alert('認証に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (isOtpSent) {
            handleVerifyOtp(data); // OTPを送信
          } else {
            handleSendOtp({ email: data.email }); // OTPメールを送信
          }
        })}
        className="space-y-4"
      >
        {!isOtpSent && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormDescription>ログインリンクが送信されます。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isOtpSent && (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ワンタイムパスワード</FormLabel>
                <FormControl>
                  <Input placeholder="6桁のコードを入力" {...field} />
                </FormControl>
                <FormDescription>メールで受信したコードを入力してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading || isVerifying}>
          {isLoading ? '送信中...' : isVerifying ? '検証中...' : isOtpSent ? '検証' : '送信'}
        </Button>
      </form>
    </Form>
  );
};
