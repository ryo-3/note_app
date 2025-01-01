'use client';

import { clientApi } from '@/app/_trpc/client';
import React, { useEffect, useState, useRef } from 'react';
import useAutoResizeTextArea from '@/hooks/useAutoResizeTextArea';

function NoteContent({
  note,
  onUpdateNote,
}: {
  note: { id: string; title: string; content: string };
  onUpdateNote: (updatedNote: { id: string; title: string }) => void;
}) {
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
    if (!hasChanges) {
      console.log('保存処理スキップ: 変更がありません');
      return; // 変更がない場合は保存しない
    }
    console.log('保存を開始します:', { title, content });
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
    console.log('サーバーに送信するデータ:', params);
    try {
      const updatedNote = await updateNoteMutation.mutateAsync(params);
      if (Array.isArray(updatedNote)) {
        // 配列の場合、各アイテムを個別にログ出力
        updatedNote.forEach((note, index) => {
          console.log(`サーバーに保存されたデータ (${index + 1}):`, note);
        });
      } else {
        console.log('サーバーに保存されたデータ:', updatedNote);
      }
      return updatedNote;
    } catch (error) {
      console.error('サーバー保存エラー:', error);
      throw error;
    }
  };

  // ノートの変更検知
  const handleChangeTitle = (newTitle: string) => {
    console.log('タイトルが変更されました:', newTitle);
    setTitle(newTitle);
    setHasChanges(true);
    onUpdateNote({ id: note.id, title: newTitle });
  };

  const handleChangeContent = (newContent: string) => {
    console.log('内容が変更されました:', newContent);
    setContent(newContent);
    setHasChanges(true);
    onUpdateNote({ id: note.id, title });
  };

  // 自動保存処理
  useEffect(() => {
    if (hasChanges) {
      console.log('変更が検知されました: 自動保存をスケジュールします');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); // 既存のタイマーをクリア
      saveTimeoutRef.current = setTimeout(() => handleSave(), 1000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  // ノート切り替え時の保存と初期化
  useEffect(() => {
    console.log('ノートが切り替えられました:', note);
    const saveAndInitialize = async () => {
      setTitle(note.title); // 新しいノートのタイトルでstateを更新
      setContent(note.content); // 新しいノートのcontentでstateを更新
      setHasChanges(false); // フラグリセット

      if (hasChanges) {
        console.log('切り替え時に未保存の変更が検知されました: 保存を実行します');
        await handleSave();
      }
    };
    saveAndInitialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]); // noteが変更された時に実行

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
      {isSaving && <p className="text-gray-500 mt-2 pl-2">保存中...</p>}
    </div>
  );
}

export default NoteContent;
