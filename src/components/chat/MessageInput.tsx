"use client";
import React, { useState, KeyboardEvent, useRef, useEffect, useCallback } from "react";

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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

  const handleAttach = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    e.target.value = "";

    for (const file of Array.from(files)) {
      const textExts = /\.(txt|md|csv|json|xml|yaml|yml|log|env|ts|tsx|js|jsx|py|rs|go|c|cpp|h|hpp|rb|php|sh|bash|zsh|css|scss|less|html|toml|ini|cfg|conf|sql|graphql|svelte|vue)$/i;
      if (textExts.test(file.name)) {
        try {
          const text = await file.text();
          const snippet = text.length > 5000 ? text.slice(0, 5000) + "\n\n[... truncated]" : text;
          onSendMessage(`I've attached \`${file.name}\`:\n\`\`\`\n${snippet}\n\`\`\``);
        } catch {
          onSendMessage(`[Attached: ${file.name}]`);
        }
      } else {
        onSendMessage(`[Attached: ${file.name}]`);
      }
    }
  }, [onSendMessage]);

  const hasText = inputValue.trim().length > 0;

  return (
    <div className="p-8 pb-10 bg-surface">
      <div className="max-w-4xl mx-auto relative group">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-full bg-surface-container-low border border-glass-border focus:border-primary-container focus:ring-0 rounded-lg px-6 py-5 pr-28 text-on-surface placeholder:text-on-surface-variant resize-none transition-all duration-300 min-h-[64px] text-[14px] outline-none"
          placeholder={isLoading ? "P.A.T.C.H is thinking..." : "Ask P.A.T.C.H. anything..."}
          rows={1}
        />
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} accept=".txt,.md,.csv,.json,.xml,.yaml,.yml,.log,.env,.ts,.tsx,.js,.jsx,.py,.rs,.go,.c,.cpp,.h,.hpp,.rb,.php,.sh,.bash,.zsh,.css,.scss,.less,.html,.toml,.ini,.cfg,.conf,.sql,.graphql,.svelte,.vue" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            onClick={handleAttach}
            className="w-10 h-10 rounded flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:bg-glass-fill transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">attach_file</span>
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !hasText}
            className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
              hasText && !isLoading
                ? "bg-primary-container text-surface-dim hover:brightness-110 active:scale-90"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
