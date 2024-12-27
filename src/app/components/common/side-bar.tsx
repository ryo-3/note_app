import React from 'react';

function SideBar() {
  if (typeof window === 'undefined') {
    console.log('これはサーバーサイドでのみ出力されます');
    // データベースアクセス、ファイル操作など、サーバーサイドでのみ行う処理
  }
  return (
    <nav className="px-4 py-3 w-[200px]">
      <h1 className="">メモ帳アプリ</h1>
      <ul>
        <li>リスト1</li>
        <li>リスト2</li>
      </ul>
    </nav>
  );
}

export default SideBar;
