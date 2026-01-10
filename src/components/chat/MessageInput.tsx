"use client";

import React, { useState, KeyboardEvent } from "react";
import { PlusCircle, SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-12 bg-gradient-to-t from-[#DAD7CD] via-[#DAD7CD]/90 to-transparent pointer-events-none z-10 flex justify-center">
      <div className="w-full max-w-3xl pointer-events-auto relative group">
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-2 pl-4 flex items-end gap-2 shadow-glass ring-1 ring-white/40 transition-all duration-300 focus-within:ring-[#588157]/50">
          <button className="mb-1.5 p-2 rounded-full text-[#3A5A40]/50 hover:bg-[#3A5A40]/10 transition-colors">
            <PlusCircle className="w-6 h-6" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full bg-transparent border-none focus:ring-0 text-[#3A5A40] placeholder-[#3A5A40]/40 py-4 px-2 resize-none max-h-32 leading-relaxed focus:outline-none"
            placeholder={
              isLoading ? "P.A.T.C.H is thinking..." : "Message P.A.T.C.H..."
            }
            rows={1}
            style={{ minHeight: "56px" }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="mb-1 p-3 rounded-full bg-[#588157] text-white hover:bg-[#3A5A40] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[11px] mt-3 opacity-40 font-medium tracking-wide text-[#344E41]">
          P.A.T.C.H may produce inaccurate information.
        </p>
      </div>
    </div>
  );
};
