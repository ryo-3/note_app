'use client';

import React, { useState } from 'react';
import { clientApi } from '@/app/_trpc/client';
import NoteItem from './note-item';
import NoteList from './note-list';

const Note = () => {
  const { data: notes = [], isLoading, error } = clientApi.notes.getAllNotes.useQuery();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load notes.</p>;

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || notes[0];

  return (
    <div className="flex">
      <div className="px-4 py-3 w-[200px] border-r-2 min-h-screen border-black">
        <button>新規追加</button>
        <NoteList
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onSelect={(id) => setSelectedNoteId(id)}
        />
      </div>

      <div className="px-10 pt-5 pb-20 w-full">
        {selectedNote && <NoteItem note={selectedNote} />}
      </div>
    </div>
  );
};

export default Note;
