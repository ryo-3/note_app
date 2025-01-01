'use client';

import { clientApi } from '@/app/_trpc/client';
import React, { useEffect, useState, useRef } from 'react';
import useAutoResizeTextArea from '@/hooks/useAutoResizeTextArea';

function NoteContent({ note }: { note: { id: string; title: string; content: string } }) {
  const updateNoteMutation = clientApi.notes.updateNote.useMutation();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ
  const [hasChanges, setHasChanges] = useState(false); // 変更検知フラグ
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さ調整フック
  useAutoResizeTextArea(textareaRef, content);

  // 保存処理
  const handleSave = async () => {
    if (!hasChanges) return; // 変更がない場合は保存しない
    setIsSaving(true);
    try {
      await saveNoteToServer({ id: note.id, title, content });
      setHasChanges(false); // 保存後に変更フラグをリセット
    } catch (error) {
      console.error('保存に失敗しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // サーバー保存処理
  const saveNoteToServer = async (params: { id: string; title: string; content: string }) => {
    try {
      const updatedNote = await updateNoteMutation.mutateAsync(params);
      console.log('サーバーに保存されました:', updatedNote);
      return updatedNote;
    } catch (error) {
      console.error('サーバー保存エラー:', error);
      throw error;
    }
  };

  // ノートの変更検知
  const handleChangeTitle = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(true);
  };

  const handleChangeContent = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  // 自動保存処理
  useEffect(() => {
    if (hasChanges) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); // 既存のタイマーをクリア
      saveTimeoutRef.current = setTimeout(() => handleSave(), 2000); // 入力停止後2秒で保存
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content]);

  // ノート切り替え時の保存と初期化
  useEffect(() => {
    const saveAndInitialize = async () => {
      if (hasChanges) await handleSave();
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false); // フラグリセット
    };
    saveAndInitialize();
  }, [note]);

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => handleChangeTitle(e.target.value)}
        placeholder="題名"
        className="w-full focus:outline-none border-gray-300 mb-2 text-lg py-1 px-2 rounded-lg bg-transparent"
      />
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleChangeContent(e.target.value)}
        rows={0}
        placeholder="内容"
        className="w-full focus:outline-none resize-none p-2 rounded-lg bg-transparent"
      />
      {isSaving && <p className="text-gray-500 mt-2 pl-2"></p>}
    </div>
  );
}

export default NoteContent;
