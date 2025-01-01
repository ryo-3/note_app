import { useEffect } from 'react';

const useAutoResizeTextArea = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  content: string
) => {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 高さリセット
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 内容に応じた高さに調整
    }
  }, [textareaRef, content]);
};

export default useAutoResizeTextArea;
