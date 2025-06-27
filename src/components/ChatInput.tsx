// components/chat/ChatInput.tsx
import { useState,useEffect,useRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const ChatInput: React.FC<{ onSendMessage: (message: string) => Promise<void>; isLoading: boolean; }> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="px-4 pb-4">
      <form onSubmit={handleSubmit} className="relative mx-auto max-w-4xl rounded-xl bg-[#232323] p-2 shadow-lg ring-1 ring-gray-700">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? handleSubmit(e) : undefined}
          placeholder="Enter a prompt here"
          className="w-full resize-none border-0 bg-transparent p-3 pr-20 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#464646]"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <LoadingSpinner /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>}
        </button>
      </form>
    </div>
  );
};
