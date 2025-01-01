'use client';

import React from 'react';
import NoteList from './note-list';
import LogoutButton from './logout-button';
import { clientApi } from '@/app/_trpc/client';

const Sidebar = ({
  notes,
  selectedNoteId,
  refetchNotes,
  setSelectedNoteId,
}: {
  notes: { id: string; title: string }[];
  selectedNoteId: string | null;
  refetchNotes: () => Promise<void>;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const createNote = clientApi.notes.createNote.useMutation();

  const handleCreateNewNote = async () => {
    try {
      const newNote = await createNote.mutateAsync({
        title: ``,
        content: ``,
      });

      // メモ一覧を再取得して更新
      await refetchNotes();
      // 作成したメモを選択状態に設定
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.log(`新規メモの作成に失敗しました:`, error);
    }
  };

  const handleSelectNote = async (id: string) => {
    setSelectedNoteId(id);
    await refetchNotes();
  };

  return (
    <div className="px-4 pt-4 pb-5 h-full border-r-2 min-h-screen border-gray-200 flex flex-col justify-between">
      <div>
        <button
          className="bg-primary text-white font-bold w-full text-left p-2 rounded mb-3 hover:bg-primary/90 transition -100"
          onClick={handleCreateNewNote}
        >
          新規追加
        </button>
        <NoteList notes={notes} selectedNoteId={selectedNoteId} onSelect={handleSelectNote} />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
