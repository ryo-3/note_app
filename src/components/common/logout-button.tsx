'use client';

import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';

function LogoutButton() {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('ログアウトに失敗しました:', error);
        return;
      }

      window.location.href = '/login';
    } catch (err) {
      console.error('ログアウト処理中にエラーが発生しました:', err);
    }
  };

  return (
    <>
      {/* ログアウトボタン */}
      <div className="mt-5">
        <p
          className="cursor-pointer px-2 py-2 flex items-center gap-2 rounded-lg text-center hover:bg-gray-300 transition"
          onClick={() => setShowModal(true)} // モーダルを表示
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="h-5 w-5 fill-current mb-[1px]"
          >
            <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z" />
          </svg>
          <span className="font-bold">ログアウト</span>
        </p>
      </div>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative">
            {/* モーダルを閉じる×ボタン */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <span className="flex justify-center text-lg">ログアウトしますか？</span>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowModal(false)} // モーダルを閉じる
              >
                キャンセル
              </button>
              <button
                className="px-4 py-1.5 rounded-lg bg-slate-600 text-white hover:bg-black transition"
                onClick={async () => {
                  await handleLogout(); // ログアウト処理を実行
                  setShowModal(false); // モーダルを閉じる
                }}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutButton;
