import { useEffect, useRef, useState } from 'react';

export const useSyncNotes = (notes: { id: string; title: string }[]) => {
  const [noteState, setNoteState] = useState(notes);
  const previousTitlesRef = useRef<string | null>(null);

  useEffect(() => {
    const titlesString = JSON.stringify(notes.map((note) => note.title));
    if (previousTitlesRef.current !== titlesString) {
      setNoteState(notes);
      previousTitlesRef.current = titlesString;
    }
  }, [notes]);

  return { noteState, setNoteState }; // setNoteState を返す
};
