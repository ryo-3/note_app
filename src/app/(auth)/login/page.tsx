import LoginForm from '@/components/login/login-form';
import React from 'react';
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-primary">ログインフォーム</h1>
        <LoginForm />
      </div>
    </div>
  );
}
