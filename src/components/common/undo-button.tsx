'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function UndoButton() {
  const [activeClass, setActiveClass] = useState('');
  const [isAnimating, setIsAnimating] = useState(false); // アニメーション中かどうかを管理

  const undoRemoval = () => {
    if (!isAnimating) {
      // アニメーション中でなければ開始
      setIsAnimating(true);
      setActiveClass('active-open');
    }
    console.log('undo');
    // ここに undo のロジックを追加
  };

  useEffect(() => {
    if (activeClass === 'active-open') {
      const timer1 = setTimeout(() => {
        setActiveClass('active-close');
      }, 1500);

      const timer2 = setTimeout(() => {
        setActiveClass('');
        setIsAnimating(false); // アニメーション終了
      }, 2200);

      return () => {
        // クリーンアップ関数
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [activeClass]);

  return (
    <button
      onClick={undoRemoval}
      className="fixed bottom-4 right-20 bg-white w-14 h-14 border border-stone-300 rounded-full flex justify-center items-center"
    >
      <Image src="/UndoButton.png" alt="削除" width={32} height={32} priority />
      <Image
        src="/TrashLid.png"
        alt="蓋"
        width={22}
        height={22}
        priority
        className={`trashLid  ${activeClass}`}
      />
    </button>
  );
}

export default UndoButton;
