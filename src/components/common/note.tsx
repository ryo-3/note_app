'use client';

import React, { useState } from 'react';
import { clientApi } from '@/app/_trpc/client';
import NoteContent from './note-content';
import Sidebar from './sidebar';
import { useSyncNotes } from '@/hooks/useSyncNotes';
import NoteLayout from './note-layout';

const Note = () => {
  const { data: notes = [], isLoading, error, refetch } = clientApi.notes.getAllNotes.useQuery();
  const { noteState, setNoteState } = useSyncNotes(notes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleUpdateNote = (updatedNote: { id: string; title: string }) => {
    console.log('handleUpdateNote が呼び出されました:', updatedNote);
    setNoteState((prevNotes) =>
      prevNotes.map((note) => {
        const isMatch = note.id === updatedNote.id;
        return isMatch ? { ...note, title: updatedNote.title } : note;
      })
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load notes.</p>;

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || notes[0];

  return (
    <div className="h-screen">
      <NoteLayout
        sidebar={
          <Sidebar
            notes={noteState.map((note) => ({ id: note.id, title: note.title }))}
            selectedNoteId={selectedNote?.id || null}
            refetchNotes={async () => {
              await refetch();
            }}
            setSelectedNoteId={setSelectedNoteId}
          />
        }
        content={
          <div className="px-6 pt-5 pb-20 w-full h-full">
            {selectedNote && <NoteContent note={selectedNote} onUpdateNote={handleUpdateNote} />}
          </div>
        }
      />
    </div>
  );
};

export default Note;
