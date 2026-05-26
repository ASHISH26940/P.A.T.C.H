"use client";
import React, { useState, KeyboardEvent, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="p-8 pb-10 bg-surface">
      <div className="max-w-4xl mx-auto relative group">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-full bg-surface-container-low border border-glass-border focus:border-primary-container focus:ring-0 rounded-lg px-6 py-5 pr-24 text-on-surface placeholder:text-on-surface-variant resize-none transition-all duration-300 min-h-[64px] text-[14px] outline-none"
          placeholder="Ask P.A.T.C.H. anything..."
          rows={1}
        />
        <div className="absolute right-3 bottom-2.5 flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary-container transition-colors" type="button">
            <span className="material-symbols-outlined text-[24px]">attach_file</span>
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 bg-primary-container text-surface-dim rounded hover:brightness-110 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
