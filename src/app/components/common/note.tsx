'use client';

import React, { useEffect, useRef, useState } from 'react';

function Note() {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handeleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  });

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handeleChange}
        rows={10}
        placeholder=""
        className="w-full focus:outline-none resize-none"
      />
    </div>
  );
}

export default Note;
