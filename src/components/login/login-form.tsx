'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import EmailField from '@/components/login/email-field';
import OneTimePasswordField from '@/components/login/one-time-password-field';
import { useRouter } from 'next/navigation';
import { otp, sendOtpToEmail } from '@/app/(auth)/login/actions';

// フォームのバリデーションスキーマ
const emailSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

const otpSchema = emailSchema.extend({
  oneTimePassword: z.string().length(6, '6桁のワンタイムパスワードを入力してください'),
});

type EmailSchema = z.infer<typeof emailSchema>;
type OtpSchema = z.infer<typeof otpSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<'email' | 'otp'>('email'); // フォームステップ管理
  const [message, setMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // 送信中かどうか
  const [isSuccess, setIsSuccess] = React.useState(false); // 認証成功かどうか
  const [isError, setIsError] = React.useState(false); // エラー状態を管理

  // メールアドレスフォーム
  const emailForm = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // ワンタイムパスワードフォーム
  const otpForm = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      oneTimePassword: '',
    },
  });

  const handleEmailSubmit = async (data: EmailSchema) => {
    if (isSuccess) return; // 認証成功後は処理をスキップ
    setIsSubmitting(true); // 送信中に設定
    try {
      // サーバーにメール送信リクエストを送る
      const result = await sendOtpToEmail({ email: data.email });

      if (!result.success) {
        console.log('メール送信エラー:', result.error);
        setIsError(true);
        setMessage(`メール送信に失敗しました`);
      } else {
        setIsError(false);
        setMessage(
          `メールアドレス宛にワンタイムパスワードを送信しました\nメールをご確認ください。`
        );

        otpForm.setValue('email', data.email); // OTPフォームにメールを設定
        setStep('otp'); // OTP入力ステップに移行
      }
    } finally {
      setIsSubmitting(false); // 送信終了
    }
  };

  const handleOtpSubmit = async (data: OtpSchema) => {
    if (isSuccess) return; // 認証成功後は処理をスキップ
    setIsSubmitting(true); // 送信中に設定

    try {
      // console.log("ワンタイムパスワード認証:", data);

      // サーバーサイドで OTP 検証とロール情報の取得を実行
      const result = await otp(data);

      if (result.success) {
        setMessage('認証に成功しました！ログイン中です');
        setIsSuccess(true);

        // ロール情報に基づいてリダイレクト
        if (result.userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        console.log('OTP認証エラー:', result.errorCode);

        setMessage(
          'ワンタイムパスワードの認証に失敗しました。\n無効なパスワードか、有効期限が切れている可能性があります。'
        );
        setIsError(true);
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setMessage('エラーが発生しました。もう一度お試しください。');
      setIsError(true);
    } finally {
      setIsSubmitting(false); // 送信終了
    }
  };

  return (
    <div className="flex justify-center">
      {step === 'email' && (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
            className="w-full max-w-sm  space-y-6 bg-white/90 rounded-xl"
          >
            {/* メールアドレスフィールド */}
            <EmailField<EmailSchema> control={emailForm.control} name="email" />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span> 送信中...</span>
                </div>
              ) : (
                <div>
                  <span>送信</span>
                </div>
              )}
            </Button>
            {message && (
              <div className={`p-4 rounded-lg ${isError ? 'text-error' : 'text-success'}`}>
                <p className="text-sm whitespace-pre-line">{message}</p>
              </div>
            )}
          </form>
        </Form>
      )}

      {step === 'otp' && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="w-full max-w-sm space-y-6 bg-white/90 backdrop-blur-sm"
          >
            {/* ワンタイムパスワードフィールド */}
            <OneTimePasswordField<OtpSchema> control={otpForm.control} name="oneTimePassword" />
            <Button
              type="submit"
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  認証中...
                </div>
              ) : (
                '認証'
              )}
            </Button>
            {message && (
              <div className={` rounded-lg ${isError ? ' text-error' : ' text-success '}`}>
                <p className="text-sm whitespace-pre-line">{message}</p>
              </div>
            )}
            {isError && (
              <div className="flex justify-end mt-2">
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                  onClick={() => {
                    otpForm.reset();
                    setMessage(null);
                    setIsError(false);
                    setStep('email');
                  }}
                >
                  戻る
                </Button>
              </div>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
