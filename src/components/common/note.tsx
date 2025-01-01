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
  const selectedNote = notes.find((note) => note.id === selectedNoteId) || notes[0];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load notes.</p>;

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
            {selectedNote && <NoteContent note={selectedNote} setNoteState={setNoteState} />}
          </div>
        }
      />
    </div>
  );
};

export default Note;
