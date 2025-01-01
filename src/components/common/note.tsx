'use client';

import React, { useEffect, useRef, useState } from 'react';
import { clientApi } from '@/app/_trpc/client';
import NoteList from './note-list';
import NoteContent from './note-content';

const Note = () => {
  const { data: notes = [], isLoading, error, refetch } = clientApi.notes.getAllNotes.useQuery();
  const createNote = clientApi.notes.createNote.useMutation();
  const [noteState, setNoteState] = useState(notes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const previousTitlesRef = useRef<string | null>(null);

  useEffect(() => {
    // notes のタイトルだけを取り出して文字列化
    const titlesString = JSON.stringify(notes.map((note) => note.title));
    if (previousTitlesRef.current !== titlesString) {
      setNoteState(notes); // タイトルが変わった場合のみ状態を更新
      previousTitlesRef.current = titlesString; // 前回のタイトルを更新
    }
  }, [notes]);

  const handeleCreateNewNote = async () => {
    try {
      const newNote = await createNote.mutateAsync({
        title: ``,
        content: ``,
      });

      console.log(`新規メモが作成されました:`, newNote);

      // メモ一覧を再取得して更新
      await refetch();
      // 作成したメモを選択状態に設定
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.log(`新規メモの作成に失敗しました:`, error);
    }
  };

  const handleUpdateNote = (updatedNote: { id: string; title: string }) => {
    // console.log('親コンポーネントで受け取った更新内容:', updatedNote);

    // 該当ノートのタイトルを更新
    setNoteState((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? { ...note, title: updatedNote.title } : note
      )
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load notes.</p>;

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || notes[0];

  return (
    <div className="flex">
      <div className="px-4 py-4 w-[200px] border-r-2 min-h-screen border-gray-200">
        <button
          className="bg-primary text-white font-bold w-full text-left p-2 rounded mb-3 hover:bg-primary/90 transition duration-300"
          onClick={handeleCreateNewNote}
        >
          新規追加
        </button>
        <NoteList
          notes={noteState.map((note) => ({ id: note.id, title: note.title }))}
          selectedNoteId={selectedNote?.id || null}
          onSelect={(id) => setSelectedNoteId(id)}
        />
      </div>

      <div className="px-6 pt-5 pb-20 w-full">
        {selectedNote && <NoteContent note={selectedNote} onUpdateNote={handleUpdateNote} />}
      </div>
    </div>
  );
};

export default Note;
