'use client';

import React from 'react';

const AddNoteButton = ({ onAddNote }: { onAddNote: () => void }) => {
  return (
    <button
      onClick={onAddNote}
      className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      新規追加
    </button>
  );
};

export default AddNoteButton;
