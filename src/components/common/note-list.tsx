'use client';

import React from 'react';

const NoteList = ({
  notes,
  selectedNoteId,
  onSelect,
}: {
  notes: { id: string; title: string }[];
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
}) => {
  return (
    <nav className="">
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id}>
            <button
              onClick={() => onSelect(note.id)}
              className={`block w-full text-left p-2 rounded ${
                selectedNoteId === note.id ? 'bg-primary/80 text-white' : 'hover:bg-muted'
              }`}
            >
              {note.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NoteList;
