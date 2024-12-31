'use client';

import React, { useEffect, useState, useRef } from 'react';

function NoteItem({ note }: { note: { id: string; title: string; content: string } }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]); // ノートが切り替わるたびに更新

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="w-full focus:outline-none border-b border-gray-300 mb-2 text-lg pb-1"
      />
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        placeholder="内容を入力してください"
        className="w-full focus:outline-none resize-none"
      />
    </div>
  );
}

export default NoteItem;
