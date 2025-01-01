'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { clientApi } from '@/app/_trpc/client';

function DeleteButton({
  noteId,
  refetchNotes,
}: {
  noteId: string;
  refetchNotes: () => Promise<void>;
}) {
  const [activeClass, setActiveClass] = useState('');
  const deleteNoteMutation = clientApi.notes.deleteNote.useMutation();

  const handleClick = async () => {
    setActiveClass('active-open');
    const timer1 = setTimeout(() => {
      setActiveClass('active-close');
    }, 1500);
    const timer2 = setTimeout(() => {
      setActiveClass('');
    }, 2200);

    try {
      // ノート削除処理
      await deleteNoteMutation.mutateAsync({ id: noteId });
      console.log(`ノートが削除されました: ${noteId}`);
      await refetchNotes(); // 削除後にリストを再取得
    } catch (error) {
      console.error(`ノートの削除に失敗しました:`, error);
    }

    // クリーンアップ関数でタイマーをクリア
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-white w-14 h-14 border border-stone-300 rounded-full flex justify-center items-center"
    >
      <Image src="/DeleteButton.png" alt="Delete" width={32} height={32} priority />
      <Image
        src="/TrashLid.png"
        alt="蓋"
        width={22}
        height={22}
        priority
        className={`trashLid ${activeClass}`}
      />
    </button>
  );
}

export default DeleteButton;
