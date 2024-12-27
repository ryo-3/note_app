import React from 'react';
import { LoginForm } from '@/components/common/login-form';
// import SessionStatus from '@/components/common/session-status';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">ログインフォーム</h1>
        <LoginForm />
        {/* <SessionStatus /> */}
      </div>
    </div>
  );
}
